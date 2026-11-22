// The edits made to questions in the editor (typst-editor.tsx), kept in this
// browser (localStorage), one entry per question: the editor opens with them,
// the question's slide is shown as edited, and its Typst is downloaded so.
import React from "react";
import {
    splitDocument,
    typstDocument,
    type TypstBundle,
} from "./typst-document";

/** A question's edits, as the editor left them. */
export type SavedEdit = {
    /** The question's source that was edited (the site's, then). */
    base: string;
    /** The question, as edited. */
    question: string;
    /** The head of its document (`splitDocument`), if edited. */
    head: string | null;
    /** The whole document, if that was being edited. */
    document: string | null;
};

const PREFIX = "typst-edit:";
/** Sent on `window` when this page changes a question's edits. */
const CHANGED = "saved-edit-changed";

/** The edits reverted on this page, by question: what Undo brings back. */
const reverted = new Map<string, SavedEdit>();
/** Why each question's edits do not compile, as last compiled on this page. */
const errors = new Map<string, string>();

function read(name: string): string | null {
    try {
        return localStorage.getItem(PREFIX + name);
    } catch {
        return null;
    }
}

function parse(text: string | null): SavedEdit | null {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

/** The question's saved edits, if it has any (and storage can be read). */
export function loadEdit(name: string): SavedEdit | null {
    return parse(read(name));
}

/**
 * Keeps the question's edits, or with `null` forgets them. False if they could
 * not be kept (storage blocked, or full). New edits replace any reverted ones.
 */
export function saveEdit(name: string, edit: SavedEdit | null): boolean {
    if (edit) reverted.delete(name);
    let saved = true;
    try {
        if (edit) localStorage.setItem(PREFIX + name, JSON.stringify(edit));
        else localStorage.removeItem(PREFIX + name);
    } catch {
        saved = false;
    }
    window.dispatchEvent(new Event(CHANGED));
    return saved;
}

/** Forgets the question's edits, which Undo (`undoRevert`) brings back. */
export function revertEdit(name: string, edit: SavedEdit | null) {
    if (edit) reverted.set(name, edit);
    saveEdit(name, null);
}

/** Brings back the edits last reverted, if they have not been replaced. */
export function undoRevert(name: string) {
    const edit = reverted.get(name);
    if (edit) saveEdit(name, edit);
}

/** Notes why the question's edits do not compile, or that they do (null). */
export function setEditError(name: string, error: string | null) {
    if ((errors.get(name) ?? null) === error) return;
    if (error === null) errors.delete(name);
    else errors.set(name, error);
    window.dispatchEvent(new Event(CHANGED));
}

function subscribe(onChange: () => void) {
    // This page's changes, and other tabs'.
    window.addEventListener(CHANGED, onChange);
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(CHANGED, onChange);
        window.removeEventListener("storage", onChange);
    };
}

/**
 * The question's saved edits, kept up to date (none while rendering on the
 * server). The same object until they change.
 */
export function useSavedEdit(name: string): SavedEdit | null {
    // The stored text is the snapshot: equal strings are the same snapshot.
    const text = React.useSyncExternalStore(
        subscribe,
        () => read(name),
        () => null
    );
    return React.useMemo(() => parse(text), [text]);
}

/** The edits last reverted, while Undo can bring them back. */
export function useRevertedEdit(name: string): SavedEdit | null {
    return React.useSyncExternalStore(
        subscribe,
        () => reverted.get(name) ?? null,
        () => null
    );
}

/** Why the question's edits do not compile, if they do not. */
export function useEditError(name: string): string | null {
    return React.useSyncExternalStore(
        subscribe,
        () => errors.get(name) ?? null,
        () => null
    );
}

/** The whole document of an edited question, as the editor compiles it. */
export function editedDocument(
    edit: SavedEdit,
    bundle: Pick<TypstBundle, "template" | "helpers">
): string {
    if (edit.document !== null) return edit.document;
    if (edit.head !== null) return edit.head + edit.question.trim() + "\n";
    return typstDocument(bundle, [edit.question]);
}

/**
 * The edited question alone, to put in a document with others (without any
 * edits to the template, which is the document's); null if it cannot be told
 * apart from the rest of an edited document.
 */
export function editedQuestion(edit: SavedEdit): string | null {
    if (edit.document === null) return edit.question;
    return splitDocument(edit.document)?.slides ?? null;
}

/** Whether the edits change more than the question: the template or helpers. */
export function editsTemplate(
    edit: SavedEdit,
    bundle: Pick<TypstBundle, "template" | "helpers">
): boolean {
    if (edit.document === null) return edit.head !== null;
    const split = splitDocument(edit.document);
    if (!split) return true;
    return (
        split.head !==
        splitDocument(typstDocument(bundle, [split.slides]))?.head
    );
}
