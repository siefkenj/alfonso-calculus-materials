"use client";
import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Button } from "nextra/components";
import { LanguageMenu } from "./language-menu";
import { allQuestions } from "./all-questions";
import { download, downloadTypst } from "./downloader";
import classNames from "classnames";
import { MathRender } from "./math-render";
import { useSourceLanguage } from "./source-language";
import { useSlideShape } from "./slide-shape";
import {
    ForEitherLanguage,
    LanguageLogo,
    MenuArrow,
    languageName,
} from "./language-logos";
import { fullSource, typstFullDocument } from "./full-source";
import { HighlightedCode } from "./highlight";
import { preloadHighlighter, tokenize, type Token } from "./highlight-tokens";
import { makesWidescreen, withHelpers } from "./typst-document";
import { QuestionEdits } from "./edited-pill";
import { basePath, previewName, questionName, type SlideShape } from "./site";
import {
    editedDocument,
    editedQuestion,
    editsTemplate,
    loadEdit,
    setEditError,
    useRevertedEdit,
    useSavedEdit,
    type SavedEdit,
} from "./saved-edits";
import {
    compileSvg,
    describeError,
    loadTypstBundle,
    standaloneSvg,
    Superseded,
} from "./typst-compiler";

/** The live editor's code, loaded when first opened; again, after it failed. */
const loadEditor = () => React.lazy(() => import("./typst-editor"));
let LazyEditor = loadEditor();

type EditorProps = { typst: string; name: string; onClose: () => void };

/**
 * The editor; or, if its code could not be loaded (offline, or the site has
 * changed since the page was loaded), why, with Try again: not an error of
 * the whole page.
 */
class TypstEditor extends React.Component<EditorProps, { error: unknown }> {
    state = { error: null as unknown };
    static getDerivedStateFromError(error: unknown) {
        return { error };
    }
    retry = () => {
        LazyEditor = loadEditor();
        this.setState({ error: null });
    };
    render() {
        if (this.state.error !== null) {
            return (
                <EditorLoadError
                    error={this.state.error}
                    onRetry={this.retry}
                    onClose={this.props.onClose}
                />
            );
        }
        return (
            <React.Suspense fallback={null}>
                <LazyEditor {...this.props} />
            </React.Suspense>
        );
    }
}

/** In place of the editor, which could not be loaded: why, and what to do. */
function EditorLoadError({
    error,
    onRetry,
    onClose,
}: {
    error: unknown;
    onRetry: () => void;
    onClose: () => void;
}) {
    const dialog = React.useRef<HTMLDialogElement>(null);
    React.useEffect(() => {
        if (!dialog.current?.open) dialog.current?.showModal();
    }, []);
    return (
        <dialog
            ref={dialog}
            className="editor-load-error"
            aria-label="The editor could not be loaded"
            onClose={onClose}
        >
            <div className="typst-editor-error" role="alert">
                <div>
                    <p>
                        The editor could not be loaded. Check your connection,
                        and try again; if the site has been updated since this
                        page was opened, reload the page.
                    </p>
                    <pre>{describeError(error)}</pre>
                </div>
            </div>
            <div className="editor-load-error-actions">
                <Button className="outlined-button" onClick={onRetry}>
                    Try again
                </Button>
                <Button
                    className="outlined-button"
                    onClick={() => dialog.current?.close()}
                >
                    Close
                </Button>
            </div>
        </dialog>
    );
}

/** A short fingerprint of a text, to tell versions of it apart. */
function hashText(text: string): string {
    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 33) ^ text.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
}

/** The button that opens the editor of a question. */
function EditButton({
    className,
    onClick,
}: {
    className?: string;
    onClick: (e: React.MouseEvent) => void;
}) {
    return (
        <Button
            className={classNames("outlined-button", className)}
            onClick={onClick}
            title="Edit this question and see the slide as you type"
        >
            Edit
        </Button>
    );
}

/** An edited question's slide, as compiled here. */
type EditedSlide = {
    /** Its SVG, if it compiles. */
    url: string | null;
    /** Why it does not compile, if it does not. */
    error: string | null;
    /** Its shape: 4:3 if its edited template cannot make 16:9. */
    shape: SlideShape;
};

/**
 * The slide of an edited question, of `shape`, compiled here: a URL of its
 * SVG, or why it does not compile; null without edits. While `paused` (the
 * editor is open, and compiles its own), the last slide stays.
 */
function useEditedSlide(
    name: string,
    edit: SavedEdit | null,
    paused: boolean,
    shape: SlideShape
) {
    const [slide, setSlide] = React.useState<EditedSlide | null>(null);
    const replace = React.useCallback(
        (next: EditedSlide | null) =>
            setSlide((prev) => {
                if (prev?.url) URL.revokeObjectURL(prev.url);
                return next;
            }),
        []
    );
    /** What was compiled last (or is being compiled): not compiled again. */
    const compiled = React.useRef<{
        edit: SavedEdit | null;
        shape: SlideShape;
    } | null>(null);
    React.useEffect(() => {
        const last = compiled.current;
        if (paused || (last?.edit === edit && last.shape === shape)) return;
        const mine = { edit, shape };
        compiled.current = mine;
        if (!edit) {
            setEditError(name, null);
            return replace(null);
        }
        let cancelled = false;
        let done = false;
        (async () => {
            const bundle = await loadTypstBundle();
            const document = editedDocument(edit, bundle, shape);
            const made: SlideShape =
                shape === "16:9" && makesWidescreen(document) ? "16:9" : "4:3";
            const svg = await compileSvg(document, () => cancelled);
            if (cancelled) return;
            done = true;
            setEditError(name, null);
            replace({
                url: URL.createObjectURL(
                    new Blob([standaloneSvg(svg)], {
                        type: "image/svg+xml",
                    })
                ),
                error: null,
                shape: made,
            });
        })().catch((e) => {
            if (!cancelled && !(e instanceof Superseded)) {
                done = true;
                const error = describeError(e);
                setEditError(name, error);
                replace({ url: null, error, shape });
            }
        });
        return () => {
            cancelled = true;
            // Stopped before it was compiled: compiled when next asked for.
            if (!done && compiled.current === mine) compiled.current = null;
        };
    }, [name, edit, paused, shape, replace]);
    // The last URL, freed with the preview.
    const last = React.useRef(slide);
    last.current = slide;
    React.useEffect(
        () => () => {
            if (last.current?.url) URL.revokeObjectURL(last.current.url);
        },
        []
    );
    return edit ? slide : null;
}

type QuestionInfo = (typeof allQuestions)[0];

/** The definitions the questions share, by name (see typst-document.ts). */
type Helpers = Record<string, string>;

/** What a click on acts by itself, not selecting the question it is in. */
const CONTROLS =
    "a, button, input, select, textarea, summary, [role=button], [role=menu], [role=menuitem], [role=option], [role=group]";
/** What a question shows besides itself: a click there selects nothing. */
const NOT_SELECTING = ".question-source, .edited-bar, .list-edits";

/**
 * Whether a click in a question of the picker is its own, not one that
 * selects the question (by its list item, or by its <label>, which clicks
 * its checkbox): one on a control (Edit, Show source, Revert), one in its
 * source or its edits, or one in its editor, which is elsewhere in the page
 * but whose React events reach the question. In its source and its edits,
 * the <label>'s click on the checkbox is prevented too.
 */
function ownClick(e: React.MouseEvent): boolean {
    const target = e.target as Element;
    if (!e.currentTarget.contains(target)) return true;
    if (target.closest(CONTROLS)) return true;
    if (target.closest(NOT_SELECTING)) {
        e.preventDefault();
        return true;
    }
    return false;
}

/**
 * A button joined to the menu of source languages, a bar between them: the
 * button acts in the language the menu shows, which is the site-wide one, so
 * the menu changes it everywhere.
 */
function LanguageSplitButton({
    title,
    onClick,
    onIntent,
    disabled,
    busy,
    children,
}: {
    title: string;
    onClick: () => void;
    /** Called when the button is about to be clicked: pointed at, focused, pressed. */
    onIntent?: () => void;
    disabled?: boolean;
    busy?: boolean;
    children: React.ReactNode;
}) {
    const language = useSourceLanguage();
    return (
        <div className="split-button" role="group">
            <Button
                className="split-button-action"
                title={title}
                onClick={onClick}
                onPointerEnter={onIntent}
                onPointerDown={onIntent}
                onFocus={onIntent}
                disabled={disabled}
                aria-busy={busy || undefined}
            >
                {children}
            </Button>
            <LanguageMenu
                className="split-button-menu"
                title={`Source language: ${languageName(
                    language
                )}. Choose LaTeX or Typst for the sources, previews and downloads of the whole site`}
                selectedOption={
                    <>
                        <ForEitherLanguage
                            language={language}
                            render={(l) => <LanguageLogo language={l} />}
                        />
                        <MenuArrow />
                    </>
                }
            />
        </div>
    );
}

/**
 * A question's source: the question alone, or the whole document of it, which
 * compiles as it is (made here when asked for); either highlighted here
 * (highlight.tsx). What is shown stays until what replaces it has been
 * highlighted, so that nothing flickers in between; `onReady` says when there
 * is first something to show.
 */
function QuestionSource({
    question,
    code,
    typst,
    onReady,
    onEdit,
    edit,
    paused = false,
}: {
    question: QuestionInfo;
    /** The question's source in the site's language, if it has one. */
    code: string | undefined;
    /** Its Typst, alone (for its whole document). */
    typst?: string;
    /** Its edits saved in this browser, which its Typst is shown with. */
    edit?: SavedEdit | null;
    onReady: () => void;
    /** Opens the editor, if the question can be edited. */
    onEdit?: () => void;
    /**
     * While the editor is open: what is shown stays, not made again as each
     * edit is saved, but when the editor closes.
     */
    paused?: boolean;
}) {
    const language = useSourceLanguage();
    const shape = useSlideShape();
    const name = languageName(language);
    const [full, setFull] = React.useState(false);
    /**
     * What is wanted: the question or its document, in the language, of the
     * source as it is now (edited, or not).
     */
    const wanted = `${full ? "full" : "question"}/${language}/${hashText(
        (code ?? "") + JSON.stringify(edit ?? null) + (full ? shape : "")
    )}`;
    const [shown, setShown] = React.useState<{
        wanted: string;
        code: string;
        lines: Token[][] | null;
    } | null>(null);
    const [failed, setFailed] = React.useState<{
        wanted: string;
        message: string;
    } | null>(null);
    const [attempt, setAttempt] = React.useState(0);
    React.useEffect(() => {
        if (paused || shown?.wanted === wanted) return;
        let cancelled = false;
        (async () => {
            const text = !full
                ? code
                : edit
                ? editedDocument(edit, await loadTypstBundle(), shape)
                : await fullSource(language, question, typst, shape);
            if (text === undefined) {
                throw new Error(`This question has no ${name} source.`);
            }
            // Highlighted before it is shown; plain if the highlighter fails.
            const lines = await tokenize(text, language).catch(() => null);
            return { wanted, code: text, lines };
        })().then(
            (s) => {
                if (cancelled) return;
                setShown(s);
                setFailed(null);
            },
            (e) =>
                !cancelled &&
                setFailed({ wanted, message: String(e?.message ?? e) })
        );
        return () => {
            cancelled = true;
        };
        // (`shown` is read only to skip what is shown already.)
    }, [
        wanted,
        attempt,
        paused,
        full,
        shape,
        language,
        name,
        question,
        typst,
        code,
        edit,
    ]);

    const ready = shown !== null || failed !== null;
    React.useEffect(() => {
        if (ready) onReady();
    }, [ready, onReady]);

    const error = failed?.wanted === wanted ? failed.message : null;
    const pending = shown?.wanted !== wanted && !error;
    // The tab pressed is that of the code shown, which stays until what is
    // wanted replaces it (or if it cannot be made); the other is busy
    // meanwhile.
    const shownFull = shown ? shown.wanted.startsWith("full/") : full;
    /** Shows the question or the document; again after a failure. */
    const choose = (f: boolean) => {
        if (failed) setAttempt((a) => a + 1);
        setFailed(null);
        setFull(f);
    };
    return (
        <div className="question-source">
            {error && (
                <p className="question-source-status" data-state="error">
                    {error}
                </p>
            )}
            <div className="source-tabs-bar">
                <div
                    className="source-tabs"
                    role="group"
                    aria-label="How much of the source to show"
                >
                    <button
                        type="button"
                        aria-pressed={!shownFull}
                        aria-busy={(!full && pending) || undefined}
                        title={`Show only this question's ${name}, to paste into a document of slides that has the template`}
                        onClick={() => choose(false)}
                    >
                        Question
                    </button>
                    <button
                        type="button"
                        aria-pressed={shownFull}
                        aria-busy={(full && pending) || undefined}
                        title={
                            language === "typst"
                                ? "Show a whole Typst document of this question, with the slide template and what draws its graphs, to copy and compile as it is"
                                : "Show a whole LaTeX document of this question, with the slide template, to copy and compile as it is (beside its images, if it has any)"
                        }
                        onClick={() => choose(true)}
                    >
                        Full document
                    </button>
                </div>
                {onEdit && <EditButton onClick={onEdit} />}
            </div>
            {shown && (
                <HighlightedCode
                    code={shown.code}
                    // `wanted` is "question/typst/<hash>": the language it is in.
                    language={
                        shown.wanted.split("/")[1] === "typst"
                            ? "typst"
                            : "latex"
                    }
                    lines={shown.lines}
                />
            )}
        </div>
    );
}

export function QuestionPreview({
    question,
    unit,
    hideImageTitle = true,
    small = false,
    typst,
    helpers,
}: {
    question: number;
    unit: number;
    hideImageTitle?: boolean;
    small?: boolean;
    /** Its Typst, alone: for the downloads and the editor. */
    typst?: string;
    /** The definitions of the helpers it uses, which its source is shown with. */
    helpers?: Helpers;
}) {
    const language = useSourceLanguage();
    const shape = useSlideShape();
    const unitStr = String(unit).padStart(2, "0");
    const questionStr = String(question + 1);
    const id = questionName(unit, question);
    const [editing, setEditing] = React.useState(false);
    // The edits saved in this browser, which the Typst slide shows.
    const edit = useSavedEdit(id);
    const showsEdits = !small && language === "typst";
    const edited = useEditedSlide(id, showsEdits ? edit : null, editing, shape);
    /** The edits last reverted, to bring back. */
    const reverted = useRevertedEdit(id);
    // The preview in the preferred language: the LaTeX slide or the Typst one
    // (as edited, once compiled, if it has edits).
    // Of the shape chosen (as edited: 4:3 if its template cannot make 16:9).
    const preview = previewName(unit, question, shape);
    const latexUrl = `${basePath}/slides/${preview}.png`;
    /**
     * A LaTeX 16:9 preview that is not there (they are made by hand, with
     * latex-sources/render-previews.ts): the 4:3 one is shown instead.
     */
    const [missing, setMissing] = React.useState<string | null>(null);
    const fallsBack = language === "latex" && missing === latexUrl;
    const imageUrl =
        language === "typst"
            ? edited?.url ?? `${basePath}/typst/slides/${preview}.svg`
            : fallsBack
            ? `${basePath}/slides/${id}.png`
            : latexUrl;
    const shown: SlideShape =
        language === "typst"
            ? edited?.url
                ? edited.shape
                : shape
            : fallsBack
            ? "4:3"
            : shape;
    const altText = `Question ${questionStr} from Unit ${unitStr}`;
    // The same object from render to render: the source is loaded again
    // when it changes.
    const q: QuestionInfo = React.useMemo(
        () =>
            allQuestions.find(
                (q) => q.unit === unit && q.question === question
            ) || { unit, question, title: "", frame: "", images: [] },
        [unit, question]
    );
    /**
     * The source: not shown ("off"), being highlighted while the slide is
     * still shown ("opening"), or shown ("on").
     */
    const [source, setSource] = React.useState<"off" | "opening" | "on">("off");
    const sourceReady = React.useCallback(
        () => setSource((s) => (s === "opening" ? "on" : s)),
        []
    );

    // The source shown: the Typst with the definitions of its helpers first,
    // so that it compiles in any document of the template; as edited, if it
    // has been.
    const code =
        language === "typst"
            ? showsEdits && edit
                ? editedQuestion(edit) ?? edit.question
                : typst === undefined
                ? undefined
                : withHelpers(typst, helpers ?? {})
            : q.frame;

    // As tall either way, so that a 16:9 slide's text is as big as a 4:3
    // one's: wider.
    let w = shown === "16:9" ? (300 * 16) / 9 : 400;
    let h = 300;
    // The title bar, cropped off: 27 px of the LaTeX slide, 25 px of the Typst one.
    // The height shown is the same in either language (the LaTeX one's), so
    // that nothing moves when it changes: 2 px of the Typst slide's bottom
    // margin are cropped too.
    let offset = language === "typst" ? -25 : -27;
    let crop = -27;
    if (small) {
        const scale = 0.825;
        w *= scale;
        h *= scale;
        offset *= scale;
        crop *= scale;
    }
    /** The slide's shape as shown, its title bar cropped off or not. */
    const aspect = `${w} / ${hideImageTitle ? h + crop : h}`;

    return (
        <div
            className={classNames("question-preview", { small: small })}
            style={{ "--slide-width": `${w}px` } as React.CSSProperties}
        >
            <div className="header">
                <h4 className="title">
                    <MathRender content={q.title || altText} />
                </h4>
                {!small && (
                    <div className="actions">
                        <LanguageSplitButton
                            title={
                                source === "on"
                                    ? "Show the slide instead of its source"
                                    : `Show this question's ${languageName(
                                          language
                                      )} source`
                            }
                            // The highlighter loads as the button is reached
                            // for, so that it is usually there by the click.
                            onIntent={preloadHighlighter}
                            busy={source === "opening"}
                            onClick={() =>
                                setSource(source === "off" ? "opening" : "off")
                            }
                        >
                            {source === "on" ? "Show slide" : "Show source"}
                        </LanguageSplitButton>
                    </div>
                )}
            </div>
            {source !== "on" && (
                <div className="slide-frame">
                    <div
                        // Its title bar cropped off: a box of the height left,
                        // the slide moved up in it. Proportionally, so that it
                        // can be narrower on a small screen (a margin's
                        // percentage is of the width).
                        className="slide-crop"
                        style={{ width: w, aspectRatio: aspect }}
                    >
                        <Image
                            // A new image, not the old one with a new source, when the language changes.
                            key={imageUrl}
                            src={imageUrl}
                            alt={altText}
                            width={w}
                            height={h}
                            style={
                                hideImageTitle
                                    ? { marginTop: `${(offset / w) * 100}%` }
                                    : undefined
                            }
                            onError={
                                language === "latex" &&
                                shape === "16:9" &&
                                !fallsBack
                                    ? () => setMissing(latexUrl)
                                    : undefined
                            }
                        />
                    </div>
                    {!small && language === "typst" && typst && (
                        // Over the slide's corner, so that the header is the same in
                        // either language.
                        <EditButton
                            className="slide-edit-button"
                            onClick={() => setEditing(true)}
                        />
                    )}
                </div>
            )}
            {source !== "off" && (
                // Made while the slide is still shown, and shown once ready;
                // at least as tall as the slide, so that what is below it
                // does not move up (of its shape: as tall as it is shown,
                // on a narrow screen too).
                <div
                    className="source-frame"
                    hidden={source === "opening"}
                    style={{ "--slide-aspect": aspect } as React.CSSProperties}
                >
                    <QuestionSource
                        question={q}
                        code={code}
                        typst={typst}
                        onReady={sourceReady}
                        edit={showsEdits ? edit : null}
                        paused={editing}
                        onEdit={
                            language === "typst" && typst
                                ? () => setEditing(true)
                                : undefined
                        }
                    />
                </div>
            )}
            {showsEdits && (edit || reverted) && (
                // Below the slide, which it would cover; the same row in the
                // slide and source views.
                <div className="edited-bar">
                    <QuestionEdits name={id} />
                </div>
            )}
            {editing &&
                typst &&
                createPortal(
                    // Outside the picker's <label> (see `ownClick`).
                    <TypstEditor
                        typst={typst}
                        name={id}
                        onClose={() => setEditing(false)}
                    />,
                    document.body
                )}
        </div>
    );
}

export function QuestionDownloader({
    unit,
    typst = [],
    helpers,
}: {
    unit: number;
    /** Each question's Typst, in order (see question-preview.tsx). */
    typst?: (string | undefined)[];
    /** The definitions of the helpers they use. */
    helpers?: Helpers;
}) {
    const language = useSourceLanguage();
    const shape = useSlideShape();
    const unitStr = String(unit).padStart(2, "0");
    const questions = allQuestions.filter((q) => q.unit === unit);
    const [checked, _setChecked] = React.useState(() =>
        Array.from({ length: questions.length }, () => false)
    );
    /** What is being downloaded: the sources, or the PDF of the slides. */
    const [busy, setBusy] = React.useState<"source" | "pdf" | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    /** What the last download left out (edits to the template). */
    const [notice, setNotice] = React.useState<string | null>(null);
    function setChecked(i: number, value: boolean) {
        const newChecked = [...checked];
        newChecked[i] = value;
        _setChecked(newChecked);
    }
    const numSelected = checked.filter((c) => c).length;

    /**
     * Downloads the selected questions: their sources in the site's language,
     * or (in Typst) the PDF of their slides, made from the same document.
     */
    async function downloadSelected(as: "source" | "pdf") {
        const selected = questions.filter((q, i) => checked[i]);
        setBusy(as);
        setError(null);
        setNotice(null);
        try {
            if (language === "typst") {
                // As edited in this browser, if they have been.
                const edits = selected.map((q) =>
                    loadEdit(questionName(q.unit, q.question))
                );
                const bundle = edits.some(Boolean)
                    ? await loadTypstBundle()
                    : null;
                const kind = as === "pdf" ? "pdf" : "typ";
                // One question, edited: its document as edited, as the
                // editor downloads it, edits to its template and all.
                if (selected.length === 1 && edits[0] && bundle) {
                    await downloadTypst(
                        editedDocument(edits[0], bundle, shape),
                        questionName(unit, selected[0].question),
                        kind
                    );
                    return;
                }
                const sources = selected.map((q, i) => {
                    const edit = edits[i];
                    if (!edit) return typst[questions.indexOf(q)];
                    const source = editedQuestion(edit);
                    if (source === null) {
                        throw new Error(
                            `Your edited document of question ${
                                q.question + 1
                            } no longer has the line #show: mat137-slides before the question: download it on its own.`
                        );
                    }
                    return source;
                });
                // The others' template is the site's.
                const ownTemplate = selected
                    .filter(
                        (q, i) => edits[i] && editsTemplate(edits[i]!, bundle!)
                    )
                    .map((q) => q.question + 1);
                // Not a file without some of them.
                const missing = selected
                    .filter((q, i) => !sources[i])
                    .map((q) => q.question + 1);
                if (missing.length) {
                    throw new Error(
                        `No Typst source for question ${missing.join(
                            ", "
                        )}: download ${
                            missing.length > 1 ? "them" : "it"
                        } in LaTeX.`
                    );
                }
                await downloadTypst(
                    await typstFullDocument(sources as string[], shape),
                    `unit-${unitStr}-slides`,
                    kind
                );
                if (ownTemplate.length) {
                    setNotice(
                        `Your edits to the template of question ${ownTemplate.join(
                            ", "
                        )} are not in it (one template for all): download ${
                            ownTemplate.length > 1 ? "each" : "it"
                        } on its own for them.`
                    );
                }
            } else {
                await download(selected, unitStr, shape);
            }
        } catch (e) {
            setError(
                as === "pdf"
                    ? `The PDF could not be made: ${describeError(e)}`
                    : e instanceof Error
                    ? e.message
                    : `Download failed: ${String(e)}`
            );
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="question-downloader">
            <div className="short-selector">
                <div className="header">
                    <h3>Selected Questions</h3>
                    {numSelected > 0 ? ` (${numSelected} selected)` : ""}
                    <div className="download">
                        <LanguageSplitButton
                            title={
                                numSelected === 0
                                    ? "Select questions below to download them"
                                    : language === "typst"
                                    ? `Download the selected questions as one Typst file, with the slide template and what draws their graphs`
                                    : `Download the selected questions as a LaTeX file, in a zip with their images if they have any`
                            }
                            disabled={numSelected === 0 || busy !== null}
                            busy={busy === "source"}
                            onClick={() => downloadSelected("source")}
                        >
                            {busy === "source"
                                ? "Downloading..."
                                : "Download Source"}
                        </LanguageSplitButton>
                        {language === "typst" && (
                            <Button
                                className="outlined-button"
                                title={
                                    numSelected === 0
                                        ? "Select questions below to download their slides as a PDF"
                                        : "Download the slides of the selected questions as a PDF, as you have edited them, made in your browser (each #pause a slide of its own)"
                                }
                                disabled={numSelected === 0 || busy !== null}
                                aria-busy={busy === "pdf" || undefined}
                                onClick={() => downloadSelected("pdf")}
                            >
                                {busy === "pdf" ? "Making PDF..." : "PDF"}
                            </Button>
                        )}
                        {error && (
                            <span className="download-error" role="alert">
                                {error}
                            </span>
                        )}
                        {notice && (
                            <span className="download-notice" role="status">
                                {notice}
                            </span>
                        )}
                    </div>
                </div>
                <ul>
                    {questions.map((q, i) => {
                        return (
                            <li key={i} className={checked[i] ? "checked" : ""}>
                                <input
                                    type="checkbox"
                                    checked={checked[i]}
                                    onChange={(e) => {
                                        setChecked(i, e.target.checked);
                                    }}
                                    id={`list-question-${i}-checked`}
                                ></input>
                                <label
                                    htmlFor={`list-question-${i}-checked`}
                                    onClick={ownClick}
                                >
                                    {i + 1}. <MathRender content={q.title} />
                                    {language === "typst" && (
                                        // In the label, but not its checkbox's
                                        // (see `ownClick`).
                                        <span className="list-edits">
                                            <QuestionEdits
                                                name={questionName(
                                                    q.unit,
                                                    q.question
                                                )}
                                            />
                                        </span>
                                    )}
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="long-selector">
                <ul>
                    {questions.map((q, i) => {
                        const isChecked = checked[i];
                        return (
                            <li
                                key={i}
                                className={isChecked ? "checked" : ""}
                                onClick={(e) => {
                                    if (ownClick(e)) return;
                                    e.preventDefault();
                                    setChecked(i, !isChecked);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setChecked(i, !isChecked);
                                    }}
                                    id={`question-${i}-checked`}
                                ></input>
                                <div className="note">
                                    {isChecked
                                        ? "Click to unselect"
                                        : "Click to select"}
                                </div>
                                <label htmlFor={`question-${i}-checked`}>
                                    <QuestionPreview
                                        question={q.question}
                                        unit={unit}
                                        typst={typst[i]}
                                        helpers={helpers}
                                    />
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
