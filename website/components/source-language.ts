"use client";
// The source language the reader prefers (LaTeX or Typst): which source the
// question previews show and which file the downloads make. One setting for
// the whole site, kept in the browser, and changed by the switch in the
// sidebar (source-language-switch.tsx) or the menus on the questions.
import { useSyncExternalStore } from "react";

export type SourceLanguage = "latex" | "typst";

export const SOURCE_LANGUAGES: { id: SourceLanguage; name: string }[] = [
    { id: "latex", name: "LaTeX" },
    { id: "typst", name: "Typst" },
];

const KEY = "alfonso-source-language";
const listeners = new Set<() => void>();
let current: SourceLanguage | null = null;

function read(): SourceLanguage {
    try {
        return localStorage.getItem(KEY) === "typst" ? "typst" : "latex";
    } catch {
        return "latex";
    }
}

export function setSourceLanguage(language: SourceLanguage) {
    current = language;
    try {
        localStorage.setItem(KEY, language);
    } catch {}
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    // Another tab changed it.
    const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
            current = read();
            listener();
        }
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

/** The preferred source language; LaTeX until the page has loaded. */
export function useSourceLanguage(): SourceLanguage {
    return useSyncExternalStore(
        subscribe,
        () => (current ??= read()),
        () => "latex"
    );
}
