"use client";
// The live editor of a question's Typst source: the code on one side, the
// slide on the other, compiled in the browser as the code is edited (see
// typst-compiler.ts). Loaded lazily (question-preview.client.tsx), with
// CodeMirror, so that a page that is only read stays light.
//
// It edits either the question or the whole document of it (the template,
// function-graph, the question). The question is the document's end, after
// `#show: mat137-slides`; edits to what is before it (the head) are kept
// when going back to the question, and the question is then compiled with
// the edited head.
//
// The edits are kept in this browser (saved-edits.ts) as they are made, and
// are there again when the editor is next opened, until reverted.
import React from "react";
import FileSaver from "file-saver";
import { Button } from "nextra/components";
import type { CompletionSource } from "@codemirror/autocomplete";
import {
    bundleNames,
    definedIn,
    libraryNames,
    splitDocument,
    typstDocument,
    withHelpers,
    type TypstBundle,
} from "./typst-document";
import {
    compilePdf,
    compileSvg,
    describeError,
    isTypstLoaded,
    loadTypstBundle,
} from "./typst-compiler";
import {
    loadEdit,
    revertEdit,
    saveEdit,
    undoRevert,
    useRevertedEdit,
    type SavedEdit,
} from "./saved-edits";
import { EditedPill, RevertedNote } from "./edited-pill";
import { usePaneSplit } from "./pane-splitter";

type Status = {
    state: "loading" | "compiling" | "ready" | "error";
    text: string;
};

type Editor = Awaited<ReturnType<typeof createEditor>>;

/**
 * Completion of the names the code can use without defining them: the
 * template's (`#question`, `#drawing`, ..) and the helpers'
 * (`#function-graph`, `graph-px`, `lq`). The Typst language completes
 * Typst's own and those the code defines with `let`, which are left out here
 * (worked out once a version of the code).
 */
function bundleCompletions(bundle: () => TypstBundle | null): CompletionSource {
    const defined = new WeakMap<object, Set<string>>();
    return (context) => {
        const b = bundle();
        const word = context.matchBefore(/#[A-Za-z][A-Za-z0-9-]*/);
        if (!b || !word) return null;
        const doc = context.state.doc;
        let own = defined.get(doc);
        if (!own) {
            own = definedIn(doc.toString());
            defined.set(doc, own);
        }
        return {
            from: word.from + 1,
            options: bundleNames(b)
                // Typst completes the code's own `let`s, not its imports (`lq`).
                .filter(({ name, kind }) => kind === "module" || !own.has(name))
                .map(({ name, kind, from }) => ({
                    label: name,
                    type: kind === "module" ? "namespace" : kind,
                    detail: from === "template" ? "template" : "graphs",
                })),
            validFor: /^[A-Za-z0-9-]*$/,
        };
    };
}

/**
 * Typst, as `typst_lezer()` makes it, but without its own folding (of every
 * bracket, at any depth, and of headings): `libraryFolding` decides what
 * folds.
 */
function typstLanguage(
    language: typeof import("@codemirror/language"),
    typst: typeof import("codemirror-lang-typst/lezer")
) {
    const parser = new typst.TypstLezerParser(
        language.languageDataProp.add((type) =>
            type.isTop ? typst.typstLezerLanguageData : undefined
        ),
        typst.typstLezerHighlighting,
        typst.typstLezerIndentation
    );
    return new language.LanguageSupport(
        new language.Language(
            typst.typstLezerLanguageData,
            parser,
            [],
            "typst"
        ),
        [
            language.syntaxHighlighting(typst.TypstHighlightSytle),
            language.syntaxHighlighting(language.defaultHighlightStyle),
            typst.typstLezerIndentService,
            typst.typstLezerListKeymap,
            typst.typstLezerLinter,
        ]
    );
}

/**
 * Folding: of any bracket that ends a line and is closed on a later one, and
 * of a library, `#let (function-graph, ..) = { .. }`, whole, which shows its
 * names when folded. `foldLibraries` folds the libraries, as they are at
 * first: they are what the question uses, not what is edited.
 */
function libraryFolding(language: typeof import("@codemirror/language")) {
    type State = import("@codemirror/state").EditorState;
    type Line = import("@codemirror/state").Line;
    type View = import("@codemirror/view").EditorView;
    const LIBRARY = /^#let\s*\($/;
    /**
     * Where the bracket at `pos` is closed, if it is: the end of the node it
     * opens. (The grammar's brackets, `LeftParen` and `RightParen`, are not
     * of one type, which `matchBrackets` needs.) The tree is the parsed one,
     * which `syntaxTree(state)` is not until the editor next updates.
     */
    const closing = (state: State, pos: number) => {
        const tree =
            language.ensureSyntaxTree(state, state.doc.length, 50) ??
            language.syntaxTree(state);
        const node = tree.resolveInner(pos, 1);
        if (!node.name.startsWith("Left") || node.from !== pos) return null;
        const last = node.parent?.lastChild;
        return last?.name.startsWith("Right") ? last.from : null;
    };
    /** A library's names, `(..)`, and its body, `{..}`, from its first line. */
    const library = (state: State, line: Line) => {
        if (!LIBRARY.test(line.text.trimEnd())) return null;
        const open = line.from + line.text.indexOf("(");
        const close = closing(state, open);
        if (close === null) return null;
        const equals = /^\s*=\s*\{/.exec(
            state.sliceDoc(close + 1, close + 100)
        );
        if (!equals) return null;
        const end = closing(state, close + equals[0].length);
        if (end === null) return null;
        const names = libraryNames(state.sliceDoc(open + 1, close));
        return { from: line.to, to: end, names };
    };
    /** Whether the bracket at `pos` is inside another pair of brackets. */
    const nested = (state: State, pos: number) => {
        const tree =
            language.ensureSyntaxTree(state, state.doc.length, 50) ??
            language.syntaxTree(state);
        const node = tree.resolveInner(pos, 1).parent;
        for (let outer = node?.parent; outer; outer = outer.parent) {
            const [first, last] = [outer.firstChild, outer.lastChild];
            if (
                first?.name.startsWith("Left") &&
                last?.name.startsWith("Right") &&
                first.to <= pos &&
                pos < last.from
            )
                return true;
        }
        return false;
    };
    // One level: only what is not inside brackets folds, from the line that
    // opens it (not from `) = {`, which goes on a statement opened above).
    const service = language.foldService.of((state, lineStart) => {
        const line = state.doc.lineAt(lineStart);
        const lib = library(state, line);
        if (lib) return { from: lib.from, to: lib.to };
        const open = /[([{]\s*$/.exec(line.text);
        if (!open || /^\s*[)\]}]/.test(line.text)) return null;
        const from = line.from + open.index;
        if (nested(state, from)) return null;
        const to = closing(state, from);
        return to !== null && to > line.to ? { from: from + 1, to } : null;
    });
    const placeholders = language.codeFolding({
        preparePlaceholder: (state, range) =>
            library(state, state.doc.lineAt(range.from))?.names ?? null,
        placeholderDOM: (_view, onclick, names: string | null) => {
            const element = document.createElement("span");
            element.className = "cm-foldPlaceholder";
            element.textContent = names ? `${names}) = {…` : "…";
            element.title = names
                ? "What the library defines: click to show how"
                : "Click to unfold";
            element.onclick = onclick;
            return element;
        },
    });
    return {
        extensions: [service, placeholders, language.foldGutter()],
        foldLibraries(view: View) {
            const { state } = view;
            // The whole of it parsed, for its brackets to be matched.
            if (!language.ensureSyntaxTree(state, state.doc.length, 5000))
                return;
            const effects = [];
            for (let n = 1; n <= state.doc.lines; n++) {
                const lib = library(state, state.doc.line(n));
                if (lib)
                    effects.push(
                        language.foldEffect.of({ from: lib.from, to: lib.to })
                    );
            }
            if (effects.length) view.dispatch({ effects });
        },
    };
}

/**
 * A CodeMirror editor of `doc` in `parent`, calling `onChange` on each edit.
 * `label` names it for screen readers.
 */
async function createEditor(
    parent: HTMLElement,
    doc: string,
    label: string,
    onChange: (text: string) => void,
    completions: CompletionSource
) {
    const [
        { EditorView, drawSelection, highlightActiveLine, keymap },
        { EditorState },
        commands,
        language,
        autocomplete,
        typst,
    ] = await Promise.all([
        import("@codemirror/view"),
        import("@codemirror/state"),
        import("@codemirror/commands"),
        import("@codemirror/language"),
        import("@codemirror/autocomplete"),
        import("codemirror-lang-typst/lezer"),
    ]);
    const folding = libraryFolding(language);
    const extensions = [
        commands.history(),
        drawSelection(),
        highlightActiveLine(),
        language.indentOnInput(),
        language.bracketMatching(),
        ...folding.extensions,
        autocomplete.closeBrackets(),
        // Typst's completions (from the language), and the template's and helpers'.
        autocomplete.autocompletion(),
        EditorState.languageData.of(() => [{ autocomplete: completions }]),
        EditorState.tabSize.of(2),
        keymap.of([
            ...autocomplete.closeBracketsKeymap,
            ...autocomplete.completionKeymap,
            ...commands.defaultKeymap,
            ...commands.historyKeymap,
            ...language.foldKeymap,
            commands.indentWithTab,
        ]),
        typstLanguage(language, typst),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ "aria-label": label }),
        EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString());
        }),
    ];
    const view = new EditorView({
        parent,
        state: EditorState.create({ doc, extensions }),
    });
    folding.foldLibraries(view);
    return {
        text: () => view.state.doc.toString(),
        /** Replaces the text, as an edit (which can be undone). */
        replace: (text: string) => {
            view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: text },
            });
            folding.foldLibraries(view);
        },
        /** Starts again with `text`, with no history. */
        reset: (text: string) => {
            view.setState(EditorState.create({ doc: text, extensions }));
            folding.foldLibraries(view);
            onChange(text);
        },
        focus: () => view.focus(),
        destroy: () => view.destroy(),
    };
}

/** A turning ring, while Typst loads or compiles. */
function Spinner() {
    return (
        <svg
            className="typst-editor-spinner"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.25"
            />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

/** A circled exclamation mark, before an error. */
function ErrorIcon() {
    return (
        <svg
            className="typst-editor-error-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            role="img"
            aria-label="Error"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v6" />
            <path d="M12 17h.01" strokeWidth="2.5" />
        </svg>
    );
}

export default function TypstEditor({
    typst,
    name,
    onClose,
}: {
    /** The question's `#question(..)[..]`. */
    typst: string;
    /** The base of the files it downloads, e.g. "unit-07-question-3". */
    name: string;
    onClose: () => void;
}) {
    const dialog = React.useRef<HTMLDialogElement>(null);
    const questionHolder = React.useRef<HTMLDivElement>(null);
    const documentHolder = React.useRef<HTMLDivElement>(null);
    const panes = React.useRef<HTMLDivElement>(null);
    const paneSplit = usePaneSplit(panes);
    const questionEditor = React.useRef<Editor | null>(null);
    const documentEditor = React.useRef<Editor | null>(null);

    const [bundle, setBundle] = React.useState<TypstBundle | null>(null);
    const bundleRef = React.useRef(bundle);
    bundleRef.current = bundle;
    /** The question, as edited. */
    const [question, setQuestion] = React.useState("");
    /** The head of the document, if it has been edited (`splitDocument`). */
    const [head, setHead] = React.useState<string | null>(null);
    /** Whether the whole document is being edited, and its text. */
    const [full, setFull] = React.useState(false);
    const [wholeText, setWholeText] = React.useState("");
    /** Whether the editors are made, with the saved edits (if any) in them. */
    const [ready, setReady] = React.useState(false);
    /** The question's source the edits are to: the site's, or an older one. */
    const [base, setBase] = React.useState<string | null>(null);
    /** Whether the edits could not be kept in this browser. */
    const [unsaved, setUnsaved] = React.useState(false);

    const [svg, setSvg] = React.useState("");
    /** Why the document does not compile. */
    const [error, setError] = React.useState<string | null>(null);
    /** Why Typst, or the template, could not be loaded; `attempt` retries. */
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const [attempt, setAttempt] = React.useState(0);
    const [status, setStatus] = React.useState<Status>({
        state: "loading",
        text: "Loading the Typst compiler...",
    });

    React.useEffect(() => {
        dialog.current?.showModal();
    }, []);

    function failedToLoad(e: unknown) {
        setLoadError(describeError(e));
        setStatus({ state: "error", text: "Typst could not be loaded." });
    }
    function retry() {
        setLoadError(null);
        setStatus({ state: "loading", text: "Loading the Typst compiler..." });
        setAttempt((a) => a + 1);
    }

    // The template and the helpers (once loaded, the editor has them).
    React.useEffect(() => {
        if (bundle) return;
        let cancelled = false;
        loadTypstBundle().then(
            (b) => !cancelled && setBundle(b),
            (e) => !cancelled && failedToLoad(e)
        );
        return () => {
            cancelled = true;
        };
    }, [bundle, attempt]);

    /**
     * What is edited at first: the question, with the definitions of the
     * helpers it uses before it (`withHelpers`), once they have loaded.
     */
    const source = React.useMemo(
        () => (bundle ? withHelpers(typst, bundle.helpers) : null),
        [bundle, typst]
    );

    /** The document of a question, with the edited head if there is one. */
    const documentOf = React.useCallback(
        (q: string, h: string | null = head) =>
            !bundle
                ? null
                : h !== null
                ? h + q.trim() + "\n"
                : typstDocument(bundle, [q]),
        [bundle, head]
    );
    /** The document as it stands: what is compiled and downloaded. */
    const document = full ? wholeText : documentOf(question);

    // The editors, made once: the question's, and the document's; with the
    // edits saved before, if there are any.
    React.useEffect(() => {
        if (source === null) return;
        const saved = loadEdit(name);
        const startQuestion = saved?.question ?? source;
        setQuestion(startQuestion);
        setHead(saved?.head ?? null);
        setBase(saved?.base ?? source);
        if (saved?.document != null) {
            setWholeText(saved.document);
            setFull(true);
        }
        let cancelled = false;
        const completions = bundleCompletions(() => bundleRef.current);
        const made: Editor[] = [];
        Promise.all([
            createEditor(
                questionHolder.current!,
                startQuestion,
                "Typst source of the question",
                setQuestion,
                completions
            ),
            createEditor(
                documentHolder.current!,
                saved?.document ?? "",
                "Typst source of the whole document",
                setWholeText,
                completions
            ),
        ]).then(([q, d]) => {
            made.push(q, d);
            if (cancelled) return made.forEach((e) => e.destroy());
            questionEditor.current = q;
            documentEditor.current = d;
            setReady(true);
        });
        return () => {
            cancelled = true;
            made.forEach((e) => e.destroy());
            questionEditor.current = documentEditor.current = null;
            setReady(false);
        };
    }, [source, name]);

    // Compile the document, a moment after the last edit; only the newest
    // compilation's result is shown.
    const generation = React.useRef(0);
    React.useEffect(() => {
        if (document === null) return;
        const mine = ++generation.current;
        const timer = setTimeout(async () => {
            setStatus(
                isTypstLoaded()
                    ? { state: "compiling", text: "Compiling..." }
                    : {
                          state: "loading",
                          text: "Loading the Typst compiler...",
                      }
            );
            try {
                const result = await compileSvg(
                    document,
                    () => mine !== generation.current
                );
                if (mine !== generation.current) return;
                setSvg(result);
                setError(null);
                setLoadError(null);
                setStatus({ state: "ready", text: "" });
            } catch (e) {
                if (mine !== generation.current) return;
                // Not the document's fault if Typst did not load.
                if (!isTypstLoaded()) return failedToLoad(e);
                setError(describeError(e));
                setStatus({ state: "error", text: "This does not compile." });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [document, attempt]);

    // A click on the backdrop closes the dialog: one that both starts and
    // ends outside its box. (Its target is the dialog itself then, but also
    // for a click on its padding, or a drag from inside it to outside.)
    const pressedOutside = React.useRef(false);
    function outside(e: React.MouseEvent) {
        const box = dialog.current?.getBoundingClientRect();
        return (
            !!box &&
            e.target === dialog.current &&
            (e.clientX < box.left ||
                e.clientX > box.right ||
                e.clientY < box.top ||
                e.clientY > box.bottom)
        );
    }

    /** The question's end of the whole document, if it can be found. */
    const split = full ? splitDocument(wholeText) : null;

    function showDocument() {
        const doc = documentOf(question);
        if (full || doc === null || !documentEditor.current) return;
        // The document of the question as it is now; its own history, if it is
        // still that document.
        if (documentEditor.current.text() !== doc)
            documentEditor.current.reset(doc);
        else setWholeText(doc);
        setFull(true);
        documentEditor.current.focus();
    }

    function showQuestion() {
        if (!full || !split || !bundle || !questionEditor.current) return;
        // The head is kept only if it is not what the question's would be.
        const usual = splitDocument(
            typstDocument(bundle, [split.slides])
        )?.head;
        setHead(split.head === usual ? null : split.head);
        if (split.slides !== question.trim()) {
            questionEditor.current.replace(split.slides);
        }
        setFull(false);
        questionEditor.current.focus();
    }

    const edited =
        source !== null &&
        (full
            ? wholeText !== documentOf(source, null)
            : question !== source || head !== null);

    // The edits, kept a moment after the last one (as they are compiled),
    // and as the editor closes; forgotten once there are none.
    const pending = React.useRef<{ edit: SavedEdit | null } | null>(null);
    const flush = React.useCallback(() => {
        const save = pending.current;
        if (!save) return;
        pending.current = null;
        setUnsaved(!saveEdit(name, save.edit));
    }, [name]);
    React.useEffect(() => {
        if (!ready || source === null || base === null) return;
        pending.current = {
            edit: edited
                ? { base, question, head, document: full ? wholeText : null }
                : null,
        };
        const timer = setTimeout(flush, 300);
        return () => clearTimeout(timer);
    }, [ready, source, base, edited, question, head, full, wholeText, flush]);
    React.useEffect(() => () => flush(), [flush]);

    /** Whether the edits are to an older version of the question. */
    const outdated = edited && base !== null && base !== source;

    /** The edits as they are now, as they are saved; null without any. */
    const currentEdit = (): SavedEdit | null =>
        edited && base !== null
            ? { base, question, head, document: full ? wholeText : null }
            : null;

    /** The edits last reverted, which Undo brings back. */
    const reverted = useRevertedEdit(name);

    /**
     * Back to the question as the site has it, as an edit: Undo (or Ctrl+Z)
     * brings the edits back.
     */
    function revert() {
        if (source === null) return;
        revertEdit(name, currentEdit());
        setHead(null);
        setBase(source);
        if (questionEditor.current?.text() !== source) {
            questionEditor.current?.replace(source);
        }
        const doc = documentOf(source, null);
        if (full && doc !== null && documentEditor.current?.text() !== doc) {
            documentEditor.current?.replace(doc);
        }
    }

    /** The reverted edits, back in the editors as they were. */
    function undo() {
        if (!reverted) return;
        setHead(reverted.head);
        setBase(reverted.base);
        if (questionEditor.current?.text() !== reverted.question) {
            questionEditor.current?.replace(reverted.question);
        }
        if (reverted.document !== null) {
            if (documentEditor.current?.text() !== reverted.document) {
                documentEditor.current?.replace(reverted.document);
            }
            setFull(true);
        } else {
            setFull(false);
        }
        undoRevert(name);
    }

    async function download(kind: "typ" | "pdf") {
        if (document === null) return;
        try {
            if (kind === "typ") {
                FileSaver.saveAs(
                    new Blob([document], { type: "text/plain" }),
                    `${name}.typ`
                );
            } else {
                const pdf = await compilePdf(document);
                FileSaver.saveAs(
                    new Blob([pdf as BlobPart], { type: "application/pdf" }),
                    `${name}.pdf`
                );
            }
        } catch (e) {
            setError(describeError(e));
        }
    }

    // Closing (Escape, the backdrop, ✕) loses nothing: the edits are saved.
    const close = () => dialog.current?.close();

    return (
        <dialog
            ref={dialog}
            className="typst-editor"
            aria-label="Edit the question in Typst"
            onClose={onClose}
            onPointerDown={(e) => (pressedOutside.current = outside(e))}
            onClick={(e) => {
                if (pressedOutside.current && outside(e)) close();
                pressedOutside.current = false;
            }}
        >
            <div className="typst-editor-bar">
                <strong>Edit in Typst</strong>
                {!edited && reverted && <RevertedNote onUndo={undo} />}
                {edited && (
                    <EditedPill
                        label={unsaved ? "Edited, not saved" : "Edited"}
                        error={unsaved}
                        title={
                            unsaved
                                ? "You have edited this question, but your edits could not be saved in this browser: download them to keep them"
                                : "You have edited this question. Your edits are saved in this browser, and are here when you open the editor again, until you revert them."
                        }
                        onRevert={revert}
                    />
                )}
                <span
                    className="typst-editor-status"
                    role="status"
                    data-state={status.state}
                >
                    {(status.state === "loading" ||
                        status.state === "compiling") && <Spinner />}
                    {status.text}
                </span>
                <Button
                    className="outlined-button"
                    onClick={() => download("typ")}
                    disabled={document === null}
                    title="Download the question as you have edited it: one Typst file, with the slide template and what draws its graphs"
                >
                    Download .typ
                </Button>
                <Button
                    className="outlined-button"
                    onClick={() => download("pdf")}
                    disabled={document === null}
                    title="Download the slide as you have edited it, as a PDF"
                >
                    Download PDF
                </Button>
                <Button
                    className="outlined-button"
                    onClick={close}
                    aria-label="Close"
                    title="Close the editor (your edits are saved in this browser)"
                >
                    ✕
                </Button>
            </div>
            <div
                className="typst-editor-panes"
                ref={panes}
                style={paneSplit.style}
                data-dragging={paneSplit.dragging || undefined}
            >
                <div className="typst-editor-source">
                    <div
                        className="source-tabs"
                        role="group"
                        aria-label="What to edit"
                    >
                        <button
                            type="button"
                            aria-pressed={!full}
                            disabled={full && !split}
                            title={
                                full && !split
                                    ? "The question is after the line #show: mat137-slides, which the document no longer has: put it back to edit the question alone"
                                    : "Edit the question alone (your edits to the rest of the document are kept)"
                            }
                            onClick={showQuestion}
                        >
                            Question
                        </button>
                        <button
                            type="button"
                            aria-pressed={full}
                            disabled={!bundle}
                            title="Edit the whole document of the question: the slide template, what draws its graphs and the question, as it compiles on its own"
                            onClick={showDocument}
                        >
                            Full document
                        </button>
                    </div>
                    {/* Both kept, each with its history; one shown. */}
                    <div
                        className="typst-editor-code"
                        ref={questionHolder}
                        hidden={full}
                    />
                    <div
                        className="typst-editor-code"
                        ref={documentHolder}
                        hidden={!full}
                    />
                </div>
                {paneSplit.divider}
                <div className="typst-editor-preview">
                    {svg ? (
                        <div
                            className="typst-editor-slide"
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                    ) : (
                        // Where the slide will be, the size of one.
                        !error &&
                        !loadError && (
                            <div className="typst-editor-placeholder">
                                <Spinner />
                                {status.state === "loading"
                                    ? "Loading Typst..."
                                    : "Compiling..."}
                            </div>
                        )
                    )}
                    {/* Below the slide, which is the last that compiled. */}
                    {loadError ? (
                        <div className="typst-editor-error">
                            <ErrorIcon />
                            <div>
                                <p>
                                    Typst could not be loaded. Check your
                                    connection, and try again.
                                </p>
                                <pre>{loadError}</pre>
                                <Button
                                    className="outlined-button"
                                    onClick={retry}
                                    title="Load Typst again, and compile the slide"
                                >
                                    Try again
                                </Button>
                            </div>
                        </div>
                    ) : (
                        error && (
                            <div className="typst-editor-error">
                                <ErrorIcon />
                                <pre>{error}</pre>
                            </div>
                        )
                    )}
                </div>
            </div>
            <p className="typst-editor-note">
                The slide is compiled in your browser. The downloaded file
                includes the slide template and what draws any graphs, so it
                compiles on its own with <a href="https://typst.app">Typst</a>{" "}
                0.15 or later. Your edits are saved in this browser only.
                {head !== null &&
                    !full &&
                    " Your edits to the template and to what draws the graphs are kept."}
                {outdated &&
                    " The question has changed on the site since you edited it: Revert to get the new version."}
            </p>
        </dialog>
    );
}
