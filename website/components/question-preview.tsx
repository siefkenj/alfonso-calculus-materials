// The server side of the question previews: it looks up each question's LaTeX
// and renders it as a highlighted code block, which the client components in
// question-preview.client.tsx show when asked for the source.
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import { useMDXComponents as getMDXComponents } from "../mdx-components";
import { allQuestions } from "./all-questions";
import {
    QuestionPreview as ClientQuestionPreview,
    QuestionDownloader as ClientQuestionDownloader,
} from "./question-preview.client";

/** Compiled code blocks, by source, so each question is compiled once. */
const compiled = new Map<string, Promise<string>>();

/**
 * A question's LaTeX as a highlighted code block: Nextra's own rendering of a
 * fenced `latex` block, with its copy button.
 */
async function LatexSource({ frame }: { frame: string }) {
    let source = compiled.get(frame);
    if (!source) {
        // A fence longer than any run of backticks in the frame.
        const longest = Math.max(
            0,
            ...(frame.match(/`+/g) ?? []).map((r) => r.length)
        );
        const fence = "`".repeat(Math.max(3, longest + 1));
        source = compileMdx(`${fence}latex\n${frame}\n${fence}`);
        compiled.set(frame, source);
    }
    // `evaluate` rather than `MDXRemote`, which Turbopack cannot build from
    // node_modules (it imports the `next-mdx-import-source-file` alias).
    const components = getMDXComponents();
    const { default: MDXContent } = evaluate(await source, components);
    return <MDXContent components={components} />;
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
    const q = props.small
        ? undefined
        : allQuestions.find(
              (q) => q.unit === props.unit && q.question === props.question
          );
    return (
        <ClientQuestionPreview
            {...props}
            source={q && <LatexSource frame={q.frame} />}
        />
    );
}

/** The question picker of a unit's Questions page. */
export function QuestionDownloader({ unit }: { unit: number }) {
    const sources = allQuestions
        .filter((q) => q.unit === unit)
        .map((q) => <LatexSource key={q.question} frame={q.frame} />);
    return <ClientQuestionDownloader unit={unit} sources={sources} />;
}
