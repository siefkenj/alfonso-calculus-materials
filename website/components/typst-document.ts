// Assembles a Typst document of questions: the template, then the definitions
// the questions share (function-graph, which draws their graphs; inline, so
// that the document is a single file), then one `#question` per slide. Shared
// by the site's downloads and live editor and by the build
// (typst-sources/build.ts), which renders the previews with it.

import { ATTRIBUTION, type SlideShape } from "./site";

/** The Typst side of the site, as typst-sources/build.ts writes it. */
export type TypstBundle = {
    /** typst-sources/template.typ. */
    template: string;
    /**
     * The definitions the questions share, by name: `function-graph`
     * (typst-sources/function-graph.typ), which draws their graphs, with
     * lilaq (`lq`).
     */
    helpers: Record<string, string>;
    /** Each question's `#question(..)[..]`, with its drawings in it. */
    questions: { unit: number; question: number; typst: string }[];
};

/** A name in Typst: letters, digits, `-` and `_`, not starting with a digit. */
const NAME = "[A-Za-z_][A-Za-z0-9_-]*";

/**
 * The names a source defines at its top level: `#let name(..) = ..`, those of
 * a library, `#let (graphs: (function-graph, ..)) = { .. }` (not the names of
 * its groups, `graphs:`), and those it imports, `#import "..": a, b` or
 * `#import ".." as lq`.
 */
export function definedIn(source: string): Set<string> {
    const names = [
        ...source.matchAll(new RegExp(`^#let\\s+(${NAME})`, "gm")),
    ].map((m) => m[1]);
    for (const m of source.matchAll(
        new RegExp(
            `^#import\\s+"[^"\\n]*"\\s*(?:as\\s+(${NAME})|:([^\\n]*))`,
            "gm"
        )
    )) {
        if (m[1]) names.push(m[1]);
        else names.push(...(m[2].match(new RegExp(NAME, "g")) ?? []));
    }
    for (const start of source.matchAll(/^#let\s*\(/gm)) {
        // To the parenthesis that closes it.
        let depth = 0;
        let end = start.index + start[0].length - 1;
        for (; end < source.length; end++) {
            if (source[end] === "(") depth++;
            else if (source[end] === ")" && --depth === 0) break;
        }
        if (!/^\s*=/.test(source.slice(end + 1))) continue;
        const pattern = source
            .slice(start.index + start[0].length, end)
            .replace(/\/\/.*$/gm, "");
        for (const m of pattern.matchAll(
            new RegExp(`(${NAME})(\\s*:)?`, "g")
        )) {
            if (!m[2]) names.push(m[1]);
        }
    }
    return new Set(names);
}

/**
 * Each helper by the names it defines (`function-graph`, `graph-px`, `lq`, ..),
 * which code that uses any of them needs. Worked out once a set of helpers.
 */
const helperNames = new WeakMap<Record<string, string>, Map<string, string>>();
function helperOf(helpers: Record<string, string>): Map<string, string> {
    let byName = helperNames.get(helpers);
    if (!byName) {
        byName = new Map();
        for (const [helper, code] of Object.entries(helpers)) {
            byName.set(helper, helper);
            for (const name of definedIn(code)) byName.set(name, helper);
        }
        helperNames.set(helpers, byName);
    }
    return byName;
}

/**
 * The helpers whose names code uses, `function-graph(..)`, `graph-px`,
 * `lq.fill-between(..)`; not in its comments. A `//` after a `:` is a URL's
 * (`"https://.."`), not a comment: better a definition too many than one
 * missing.
 */
function uses(code: string, helpers: Record<string, string>): string[] {
    const byName = helperOf(helpers);
    const uncommented = code
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(?<!:)\/\/.*$/gm, "");
    const used = new Set<string>();
    // Whole names: `graph-px`, not the `graph` in it.
    for (const m of uncommented.matchAll(
        new RegExp(`(?<![A-Za-z0-9_-])${NAME}`, "g")
    )) {
        const helper = byName.get(m[0]);
        if (helper) used.add(helper);
    }
    return [...used];
}

/**
 * The helpers a source uses, with those they use in turn first: the order in
 * which a document must define them. Those the source defines itself are
 * left out.
 */
export function helpersUsed(
    source: string,
    helpers: Record<string, string>
): string[] {
    const own = definedIn(source);
    const order: string[] = [];
    const seen = new Set<string>(own);
    const visit = (name: string) => {
        if (seen.has(name)) return;
        seen.add(name);
        uses(helpers[name], helpers).forEach(visit);
        order.push(name);
    };
    uses(source, helpers).sort().forEach(visit);
    return order;
}

/**
 * The helpers a document of these sources must define, in order: those each
 * one uses, unless it defines them itself (an edited question, with them
 * before it), which the others may still need.
 */
export function helpersUsedByAll(
    sources: string[],
    helpers: Record<string, string>
): string[] {
    // Each source's are in order (what a helper uses first), so all of them,
    // each where it first comes, are too.
    return [...new Set(sources.flatMap((s) => helpersUsed(s, helpers)))];
}

/**
 * A question's source with the definitions of the helpers it uses before it,
 * so that it compiles in any document of the slide template: what the site
 * shows as its source, and what the editor edits.
 */
export function withHelpers(
    source: string,
    helpers: Record<string, string>
): string {
    const names = helpersUsed(source, helpers);
    return [...names.map((name) => helpers[name].trim()), source.trim()].join(
        "\n\n"
    );
}

/**
 * What a library's pattern, `#let (..) = {`, defines, on one line as it is
 * shown folded: `graphs: (function-graph, graph-fn), style: (graph-px)`.
 * `pattern` is what is between its parentheses, comments and all.
 */
export function libraryNames(pattern: string): string {
    return pattern
        .split("\n")
        .map((l) => l.replace(/\/\/.*$/, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*\)/g, ")")
        .replace(/\(\s+/g, "(")
        .trim()
        .replace(/,$/, "");
}

/**
 * The libraries in `code`, `#let (names) = { .. }` as the template and
 * function-graph.typ are laid out (`) = {` and `}` alone on their lines): the
 * lines of each, from its first to its last, and what it defines, as it is
 * shown folded.
 */
export function libraryFolds(
    code: string
): { first: number; last: number; names: string }[] {
    const lines = code.split("\n");
    const folds = [];
    for (let i = 0; i < lines.length; i++) {
        if (!/^#let\s*\(\s*$/.test(lines[i])) continue;
        const body = lines.findIndex(
            (l, k) => k > i && /^\)\s*=\s*\{\s*$/.test(l)
        );
        const last = lines.findIndex((l, k) => k > body && l.trimEnd() === "}");
        if (body < 0 || last < 0) continue;
        const names = libraryNames(lines.slice(i + 1, body).join("\n"));
        folds.push({ first: i, last, names });
        i = last;
    }
    return folds;
}

const HEADER = ATTRIBUTION.map((line) => `// ${line}`).join("\n");

/** The line of a document after which its slides come. */
const SLIDES_START = /^#show: mat137-slides[^\n]*\n/m;

/** The line `#show: mat137-slides`, as the site writes it, of either shape. */
const SHOW_LINE =
    /^#show: mat137-slides(?:\.with\(aspect-ratio: "(?:4-3|16-9)"\))?[ \t]*$/m;

/**
 * Whether a document's template can make 16:9 slides: one from before that
 * (in the edits saved in a browser) cannot, and its slides stay 4:3.
 */
export function makesWidescreen(document: string): boolean {
    const show = SLIDES_START.exec(document);
    return /\baspect-ratio\s*:/.test(
        show ? document.slice(0, show.index) : document
    );
}

/**
 * A document with its slides of `shape`: its line `#show: mat137-slides`
 * made `#show: mat137-slides.with(aspect-ratio: "16-9")`, or back; 4:3 if
 * its template cannot make 16:9 (`makesWidescreen`). A line that has been
 * edited otherwise (`.with(copyright: ..)`) is left as it is.
 */
export function withSlideShape(document: string, shape: SlideShape): string {
    const wide = shape === "16:9" && makesWidescreen(document);
    return document.replace(
        SHOW_LINE,
        wide
            ? '#show: mat137-slides.with(aspect-ratio: "16-9")'
            : "#show: mat137-slides"
    );
}

/**
 * A document of `typstDocument`'s, split into its head (the header, the
 * template, the helpers, up to the slides) and its slides, so that `head +
 * slides + "\n"` is the document again; or null if it no longer has the line
 * `#show: mat137-slides` between them.
 */
export function splitDocument(
    document: string
): { head: string; slides: string } | null {
    const start = SLIDES_START.exec(document);
    if (!start) return null;
    const end = start.index + start[0].length;
    return {
        head: document.slice(0, end) + "\n",
        slides: document.slice(end).trim(),
    };
}

/** A name the questions can use without defining it, for completion. */
export type BundleName = {
    name: string;
    kind: "function" | "variable" | "module";
    /** Where it is defined: the template, or a helper (`function-graph`). */
    from: string;
};

/**
 * The names the template and the helpers define, which the questions use
 * without defining them. Worked out once a bundle.
 */
const bundleNamesOf = new WeakMap<object, BundleName[]>();
export function bundleNames(
    bundle: Pick<TypstBundle, "template" | "helpers">
): BundleName[] {
    let names = bundleNamesOf.get(bundle);
    if (names) return names;
    const sources: [string, string][] = [
        ["template", bundle.template],
        ...Object.entries(bundle.helpers),
    ];
    names = sources.flatMap(([from, code]) =>
        [...definedIn(code)].map(
            (name): BundleName => ({
                name,
                // `let question(..)` is a function; `let verde = ..` is not.
                kind: new RegExp(`^\\s*#?let\\s+${name}\\(`, "m").test(code)
                    ? "function"
                    : new RegExp(
                          `^#import\\s.*\\bas\\s+${name}\\s*$`,
                          "m"
                      ).test(code)
                    ? "module"
                    : "variable",
                from,
            })
        )
    );
    bundleNamesOf.set(bundle, names);
    return names;
}

/** A whole document of the given questions' sources, its slides of `shape`. */
export function typstDocument(
    bundle: Pick<TypstBundle, "template" | "helpers">,
    sources: string[],
    shape: SlideShape = "4:3"
): string {
    const helpers = helpersUsedByAll(sources, bundle.helpers);
    // The template without the comment at its top, which is for those who
    // work on it: the document's is HEADER.
    const template = bundle.template.replace(/^(?:\/\/[^\n]*\n)+/, "");
    const parts = [HEADER, template.trim()];
    if (helpers.length) {
        parts.push(
            "// --- Graphs -----------------------------------------------------------------\n\n" +
                helpers.map((name) => bundle.helpers[name].trim()).join("\n\n")
        );
    }
    parts.push(
        "// --- Slides -----------------------------------------------------------------\n\n" +
            "#show: mat137-slides\n\n" +
            sources.map((s) => s.trim()).join("\n\n")
    );
    return withSlideShape(parts.join("\n\n") + "\n", shape);
}
