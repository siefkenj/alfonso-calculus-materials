// What the site's components share: where the site is, and loading things
// once.

/**
 * The attribution at the top of the documents of questions the site makes
 * (LaTeX and Typst), one line each, without the comment marks.
 */
export const ATTRIBUTION = [
    "© 2020 Alfonso Gracia-Saz, CC BY-SA 4.0",
    "https://siefkenj.github.io/alfonso-calculus-materials",
];

/**
 * The name of a question's files (its Typst slide, `<name>.svg`; its LaTeX
 * one, `<name>.png`) and of its saved edits: "unit-07-question-3", with the
 * question numbered from 0. Shared by the site and the build.
 */
export const questionName = (unit: number, question: number) =>
    `unit-${String(unit).padStart(2, "0")}-question-${question}`;

/** The site's base path (see next.config.mjs), before its own URLs. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * `load`, run when first asked for and its result kept; or, if it fails, run
 * again when next asked for.
 */
export function once<T>(load: () => Promise<T>): () => Promise<T> {
    let result: Promise<T> | null = null;
    return () => {
        if (result) return result;
        const loading = load();
        result = loading;
        loading.catch(() => {
            if (result === loading) result = null;
        });
        return loading;
    };
}
