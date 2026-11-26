// A question's source as a whole document, which compiles as it is: what
// "Show source" shows when asked for the full source, and what the downloads
// are made of.
import type { allQuestions } from "./all-questions";
import type { SourceLanguage } from "./source-language";
import { ATTRIBUTION, basePath, once, type SlideShape } from "./site";

type QuestionInfo = (typeof allQuestions)[0];

/** public/beamer-template.tex, fetched once. */
const latexTemplate = once(async () => {
    const res = await fetch(`${basePath}/beamer-template.tex`);
    if (!res.ok) {
        throw new Error(`Could not load the LaTeX template (${res.status})`);
    }
    return res.text();
});

/**
 * What makes a Beamer document's slides 16:9, in its preamble: as tall as a
 * 4:3 slide (Beamer's is 128 mm × 96 mm), only wider, so that what fits on
 * one fits on the other. (Beamer's own `aspectratio=169` is 160 mm × 90 mm,
 * shorter.) Also used by latex-sources/render-previews.ts.
 */
export const LATEX_WIDESCREEN = "\\geometry{papersize={170.67mm,96mm}}";

/**
 * The Beamer document of the frames, from public/beamer-template.tex, with
 * the attribution at its top, its slides of `shape`. The images they use are
 * files beside it; `imageNote` lists where to get them.
 */
export async function latexDocument(
    questions: QuestionInfo[],
    shape: SlideShape = "4:3",
    imageNote = false
): Promise<string> {
    let template = await latexTemplate();
    if (shape === "16:9") {
        template = template.replace(
            "\\begin{document}",
            `% Widescreen (16:9).\n${LATEX_WIDESCREEN}\n\n\\begin{document}`
        );
    }
    const frames = questions
        .map((q) => "\t" + q.frame.replace(/\n/g, "\n\t"))
        .join("\n\n");
    // A function, so that a `$` in the frames is not taken for a pattern.
    const document = template.replace("%%SLIDES_HERE%%", () => frames);
    const header = ATTRIBUTION.map((line) => `% ${line}`);
    const images = [...new Set(questions.flatMap((q) => q.images))];
    if (imageNote && images.length) {
        const origin =
            typeof window === "undefined" ? "" : window.location.origin;
        header.push(
            "%",
            "% This document needs these images, in the same folder as it:",
            ...images.map(
                (image) =>
                    `%   ${image}: ${origin}${basePath}/slide-images/${image}`
            )
        );
    }
    return header.join("\n") + "\n\n" + document;
}

/**
 * The Typst document of the questions: the template, their helpers, them;
 * their slides of `shape`.
 */
export async function typstFullDocument(
    sources: string[],
    shape: SlideShape = "4:3"
): Promise<string> {
    const [{ loadTypstBundle }, { typstDocument }] = await Promise.all([
        import("./typst-compiler"),
        import("./typst-document"),
    ]);
    return typstDocument(await loadTypstBundle(), sources, shape);
}

/** A question as a whole document in `language`. */
export function fullSource(
    language: SourceLanguage,
    question: QuestionInfo,
    typst: string | undefined,
    shape: SlideShape = "4:3"
) {
    if (language === "typst") {
        if (!typst)
            return Promise.reject(
                new Error("This question has no Typst source.")
            );
        return typstFullDocument([typst], shape);
    }
    return latexDocument([question], shape, true);
}
