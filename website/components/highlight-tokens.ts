// Syntax highlighting with Shiki, in the themes Nextra highlights the rest of
// the site with, for the code blocks of the questions' sources
// (highlight.tsx), in the browser. Loaded when first needed, or just before
// (`preloadHighlighter`): it is about 75 KB, which only those who look at
// the sources need.
import type { HighlighterCore } from "shiki/core";
import { once } from "./site";

export type HighlightLanguage = "latex" | "typst";

/** A token: its text, and its colours in the light and the dark theme. */
export type Token = [content: string, light?: string, dark?: string];

/** The text colours of github-light and github-dark. */
export const DEFAULT_COLORS = { light: "#24292E", dark: "#E1E4E8" };

/** The highlighter, loaded once. */
const loadHighlighter = once(async (): Promise<HighlighterCore> => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
        await Promise.all([
            import("shiki/core"),
            import("shiki/engine/javascript"),
        ]);
    return createHighlighterCore({
        themes: [
            import("shiki/themes/github-light.mjs"),
            import("shiki/themes/github-dark.mjs"),
        ],
        langs: [
            import("shiki/langs/typst.mjs"),
            import("shiki/langs/latex.mjs"),
        ],
        // No WebAssembly: the JavaScript engine handles both grammars.
        engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
});

/**
 * Starts loading the highlighter, if it has not been, for when it is needed:
 * when it is about to be (see question-preview.client.tsx).
 */
export function preloadHighlighter() {
    loadHighlighter().catch(() => {});
}

/** Each line's tokens. */
export async function tokenize(
    code: string,
    language: HighlightLanguage
): Promise<Token[][]> {
    const shiki = await loadHighlighter();
    const { tokens } = shiki.codeToTokens(code, {
        lang: language,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
    });
    return tokens.map((line) =>
        line.map((token) => {
            const style = (token.htmlStyle ?? {}) as Record<string, string>;
            const light = style["--shiki-light"];
            const dark = style["--shiki-dark"];
            // Most tokens are in the themes' own colours, which the code block
            // gives them (DEFAULT_COLORS); the rest carry theirs.
            if (light === DEFAULT_COLORS.light && dark === DEFAULT_COLORS.dark)
                return [token.content];
            return dark !== light
                ? [token.content, light, dark]
                : [token.content, light];
        })
    );
}
