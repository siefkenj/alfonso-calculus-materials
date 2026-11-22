// The server side of the question previews: it looks up the questions' Typst
// (public/typst/questions.json, made by typst-sources/build.ts) for the
// client components in question-preview.client.tsx, which show it when asked
// for the source, highlighting it there. (Their LaTeX is in all-questions,
// which they have already.) Plain code, not highlighted here: highlighted, it
// would be most of the page, in both languages, for the few who look.
import fs from "node:fs";
import path from "node:path";
import { allQuestions } from "./all-questions";
import { helpersUsedByAll, type TypstBundle } from "./typst-document";
import {
    QuestionPreview as ClientQuestionPreview,
    QuestionDownloader as ClientQuestionDownloader,
} from "./question-preview.client";

/**
 * The site's Typst, read again only when the file changes (`npm run typst`
 * while `next dev` runs).
 */
let typst: {
    modified: number;
    sources: Map<string, string>;
    helpers: TypstBundle["helpers"];
};
function loadTypst() {
    const file = path.join(process.cwd(), "public", "typst", "questions.json");
    let modified = 0;
    try {
        modified = fs.statSync(file).mtimeMs;
    } catch {}
    if (typst && typst.modified === modified) return typst;
    let bundle: TypstBundle;
    try {
        bundle = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
        // Being written (an older build.ts's, which wrote it in place): the
        // last that was read, until it is whole.
        if (e instanceof SyntaxError && typst) return typst;
        // Not made (`npm run typst` was not run, or failed): the site
        // without Typst, rather than no site.
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
        console.warn(
            `${file} is missing: run \`npm run typst\`. Showing no Typst.`
        );
        bundle = { template: "", helpers: {}, questions: [] };
    }
    typst = {
        modified,
        sources: new Map(
            bundle.questions.map((q) => [`${q.unit}/${q.question}`, q.typst])
        ),
        helpers: bundle.helpers,
    };
    return typst;
}

/**
 * The Typst of the given questions, and the definitions of the helpers they
 * use, which a question's source is shown with: once for them all, as many
 * share them (`function-graph`, which draws the graphs).
 */
function typstOf(questions: { unit: number; question: number }[]) {
    const { sources, helpers } = loadTypst();
    const typst = questions.map((q) => sources.get(`${q.unit}/${q.question}`));
    const used = helpersUsedByAll(
        typst.filter((t): t is string => !!t),
        helpers
    );
    return {
        typst,
        helpers: Object.fromEntries(used.map((name) => [name, helpers[name]])),
    };
}

/**
 * A question's slide. The small previews in the guides never show their
 * source, so only the full-size ones get it.
 */
export function QuestionPreview(props: {
    question: number;
    unit: number;
    hideImageTitle?: boolean;
    small?: boolean;
}) {
    if (props.small) return <ClientQuestionPreview {...props} />;
    const { typst, helpers } = typstOf([props]);
    return (
        <ClientQuestionPreview {...props} typst={typst[0]} helpers={helpers} />
    );
}

/** The question picker of a unit's Questions page. */
export function QuestionDownloader({ unit }: { unit: number }) {
    const { typst, helpers } = typstOf(
        allQuestions.filter((q) => q.unit === unit)
    );
    return (
        <ClientQuestionDownloader unit={unit} typst={typst} helpers={helpers} />
    );
}
