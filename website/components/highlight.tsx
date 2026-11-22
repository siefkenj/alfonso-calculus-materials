"use client";
// The code blocks of the questions' sources, as Nextra's are, with their copy
// button: highlighted already (`lines`, see highlight-tokens.ts), or
// highlighted here once the highlighter has loaded. In Typst, the libraries
// (`#let (function-graph, ..) = { .. }`) are folded, as in the editor: their
// lines are hidden, but still copied.
import React from "react";
import { Code, Pre } from "nextra/components";
import {
    DEFAULT_COLORS,
    tokenize,
    type HighlightLanguage,
    type Token,
} from "./highlight-tokens";
import { libraryFolds } from "./typst-document";

export type { HighlightLanguage, Token };

export function HighlightedCode({
    code,
    language,
    lines: given,
}: {
    code: string;
    language: HighlightLanguage;
    /** `code`'s tokens, if they are already known (see highlight-tokens.ts). */
    lines?: Token[][] | null;
}) {
    const [found, setFound] = React.useState<{
        code: string;
        lines: Token[][];
    } | null>(null);
    React.useEffect(() => {
        if (given) return;
        let cancelled = false;
        tokenize(code, language).then(
            (lines) => !cancelled && setFound({ code, lines }),
            // Unhighlighted, then: the code is still there to read and copy.
            () => {}
        );
        return () => {
            cancelled = true;
        };
    }, [code, language, given]);

    const lines =
        given ??
        (found?.code === code ? found.lines : null) ??
        // Unhighlighted, until it is.
        code
            .split("\n")
            .map((l): Token[] => [
                [l, DEFAULT_COLORS.light, DEFAULT_COLORS.dark],
            ]);
    const folds = React.useMemo(
        () => (language === "typst" ? libraryFolds(code) : []),
        [code, language]
    );
    /** The libraries unfolded, by their first lines. */
    const [unfolded, setUnfolded] = React.useState<number[]>([]);

    /** A line's tokens. */
    const tokens = (i: number) =>
        lines[i].map(([content, light, dark], j) => (
            <span
                key={j}
                style={
                    {
                        "--shiki-light": light,
                        "--shiki-dark": dark ?? light,
                    } as React.CSSProperties
                }
            >
                {content}
            </span>
        ));
    // One element a line: Nextra's code is a grid, a row each. A folded
    // library is one line, its first and last with its others hidden
    // between them (hidden, but copied with the rest).
    const shown: React.ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (i > 0) shown.push("\n");
        const fold = folds.find((f) => f.first === i);
        if (!fold) {
            shown.push(<span key={i}>{tokens(i)}</span>);
            continue;
        }
        const first = i;
        const open = unfolded.includes(first);
        const button = (
            <button
                type="button"
                className="code-fold"
                // The label is CSS's, so that it is not copied with the code.
                data-label={open ? "fold" : `${fold.names}) = {…`}
                aria-expanded={open}
                aria-label={
                    open
                        ? "Fold the library"
                        : `Show the library's code: ${fold.names}`
                }
                title={
                    open
                        ? "Fold the library"
                        : `Show the library's code: ${fold.names}`
                }
                onClick={() =>
                    setUnfolded((u) =>
                        open ? u.filter((n) => n !== first) : [...u, first]
                    )
                }
            />
        );
        if (open) {
            shown.push(
                <span key={i}>
                    {tokens(i)}
                    {button}
                </span>
            );
            continue;
        }
        const hidden: React.ReactNode[] = [];
        for (let k = first + 1; k < fold.last; k++) {
            hidden.push("\n", <span key={k}>{tokens(k)}</span>);
        }
        hidden.push("\n");
        shown.push(
            <span key={i}>
                {tokens(first)}
                {button}
                <span hidden>{hidden}</span>
                {tokens(fold.last)}
            </span>
        );
        i = fold.last;
    }
    return (
        <Pre data-copy="" data-language={language}>
            <Code
                data-language={language}
                // The colour of the tokens that carry none, which inherit it.
                style={
                    {
                        "--shiki-light": DEFAULT_COLORS.light,
                        "--shiki-dark": DEFAULT_COLORS.dark,
                    } as React.CSSProperties
                }
            >
                {shown}
            </Code>
        </Pre>
    );
}
