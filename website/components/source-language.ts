"use client";
// The source language the reader prefers (LaTeX or Typst): which source the
// question previews show and which file the downloads make. One setting for
// the whole site, kept in the browser, and changed by the switch in the
// sidebar (sidebar-settings.tsx) or the menus on the questions.
import { browserSetting } from "./browser-setting";

export type SourceLanguage = "latex" | "typst";

export const SOURCE_LANGUAGES: { id: SourceLanguage; name: string }[] = [
    { id: "latex", name: "LaTeX" },
    { id: "typst", name: "Typst" },
];

const setting = browserSetting<SourceLanguage>(
    "alfonso-source-language",
    SOURCE_LANGUAGES.map((l) => l.id),
    "latex"
);

export const setSourceLanguage = setting.set;

/** The preferred source language; LaTeX until the page has loaded. */
export const useSourceLanguage = setting.use;
