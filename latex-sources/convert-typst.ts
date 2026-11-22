/**
 * Convert the questions' Beamer frames (website/public/all-questions.json) to
 * Typst, one `#question(..)[..]` per file in
 * ../typst-sources/questions/unit-NN/qNN.typ, for the template in
 * ../typst-sources/template.typ.
 *
 * This makes a first draft. The Typst files are then edited by hand, so the
 * script never overwrites one that exists: delete a file to convert that
 * question again, or pass `--force` to convert them all again.
 *
 * Run from this directory:  npx vite-node convert-typst.ts [--force] [unit ...]
 *
 * Text is converted here; maths goes through tex2typst, except for the few
 * commands it does not know (\color, \boxed, \phantom, text with maths in it),
 * which are converted here and spliced back in. Anything it cannot convert is
 * marked `TODO` in the output.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import { unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import * as Ast from "@unified-latex/unified-latex-types";
import { tex2typst } from "tex2typst";

const QUESTIONS = "../website/public/all-questions.json";
const OUT_DIR = "../typst-sources/questions";

/** Argument signatures of the macros the frames use beyond standard LaTeX. */
const MACROS = {
    frametitle: { signature: "m" },
    pause: { signature: "" },
    only: { signature: "d<> m" },
    column: { signature: "m" },
    fontsize: { signature: "m m" },
    selectfont: { signature: "" },
    color: { signature: "m" },
    vspace: { signature: "s m" },
    addtocounter: { signature: "m m" },
    setlength: { signature: "m m" },
    href: { signature: "m m" },
    hyperlink: { signature: "m m" },
    beamergotobutton: { signature: "m" },
    DS: { signature: "m" },
    phantom: { signature: "m" },
    boxed: { signature: "m" },
    underline: { signature: "m" },
    mbox: { signature: "m" },
    columnbreak: { signature: "" },
    hrulefill: { signature: "" },
    includegraphics: { signature: "o m" },
    label: { signature: "m" },
    ref: { signature: "m" },
    eqref: { signature: "m" },
};
const ENVIRONMENTS = {
    frame: { signature: "o" },
    block: { signature: "m" },
    multicols: { signature: "m" },
    columns: { signature: "o" },
    column: { signature: "m" },
    tabular: { signature: "m" },
    minipage: { signature: "o m" },
    theorem: { signature: "o" },
};

/** Colours LaTeX knows by name; the template defines verde, rosa and naranja. */
const COLORS: Record<string, string> = {
    red: "red",
    blue: "blue",
    verde: "verde",
    rosa: "rosa",
    violet: "violet",
    naranja: "naranja",
    black: "black",
    white: "white",
    green: "green",
    orange: "orange",
    gray: "gray",
};

/** Beamer's sizes at 14 pt. */
const SIZES: Record<string, string> = {
    tiny: "8pt",
    scriptsize: "9pt",
    footnotesize: "11pt",
    small: "12pt",
    normalsize: "14pt",
    large: "17pt",
    Large: "20pt",
    LARGE: "25pt",
    huge: "25pt",
    Huge: "30pt",
};

/** Natural width of every slide image: 550 px at pdflatex's 72 dpi. */
const IMAGE_WIDTH_MM = (550 * 25.4) / 72;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const todos: string[] = [];
function todo(what: string): string {
    todos.push(what);
    return `#text(fill: red)[TODO: ${escapeText(what).replace(/\n/g, " ")}]`;
}

function mandatory(node: Ast.Macro | Ast.Environment): Ast.Node[][] {
    return (node.args ?? [])
        .filter((a) => a.openMark === "{")
        .map((a) => a.content);
}
function optional(node: Ast.Macro | Ast.Environment): Ast.Node[] | null {
    const a = (node.args ?? []).find((a) => a.openMark === "[");
    return a ? a.content : null;
}
function isMacro(node: Ast.Node | undefined, name?: string): node is Ast.Macro {
    return (
        node?.type === "macro" && (name === undefined || node.content === name)
    );
}
function isEnv(
    node: Ast.Node | undefined,
    name?: string
): node is Ast.Environment {
    return (
        node?.type === "environment" &&
        (name === undefined || printRaw(node.env) === name)
    );
}
function isBlank(node: Ast.Node): boolean {
    return (
        node.type === "whitespace" ||
        node.type === "parbreak" ||
        node.type === "comment"
    );
}

/** Escape text for Typst markup. */
function escapeText(s: string): string {
    return s
        .replace(/\\/g, "\\\\")
        .replace(/([#$*_`@<>\[\]])/g, "\\$1")
        .replace(/\/(?=[\/*])/g, "\\/");
}

/** A LaTeX length (`.5cm`, `-2mm`, `0.7\textwidth`) as a Typst length. */
function length(nodes: Ast.Node[]): string {
    const s = printRaw(nodes).trim();
    const m = s.match(/^(-?[\d.]*)\s*\\(textwidth|linewidth|columnwidth)$/);
    if (m) return `${Math.round(parseFloat(m[1] || "1") * 1000) / 10}%`;
    const u = s.match(/^(-?[\d.]+)\s*(cm|mm|pt|em|ex|in)$/);
    if (u) {
        const n = parseFloat(u[1]);
        return `${u[2] === "ex" ? n / 2 : n}${u[2] === "ex" ? "em" : u[2]}`;
    }
    return todo(`length ${s}`);
}

function indent(s: string, by: string): string {
    return s
        .split("\n")
        .map((l) => (l.trim() ? by + l : l))
        .join("\n");
}

/** Content for a Typst content block `[...]`, on one line or indented lines. */
function block(s: string): string {
    s = s.trim();
    // A list marker only counts at the start of a line, not after `[`.
    if (!s.includes("\n") && !/^\u0001?(-|\+|\d+\.)\s/.test(s)) return `[${s}]`;
    return `[\n${indent(s, "  ")}\n]`;
}

// ---------------------------------------------------------------------------
// Maths
// ---------------------------------------------------------------------------

type MathCtx = { display: boolean };

/** Typst maths with its commas outside any brackets or strings as `comma`. */
function topLevelCommas(s: string): string {
    let depth = 0;
    let inString = false;
    let out = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '"' && s[i - 1] !== "\\") inString = !inString;
        if (!inString) {
            if ("([{".includes(c)) depth++;
            if (")]}".includes(c)) depth--;
            if (c === "," && depth === 0 && s[i - 1] !== "\\") {
                out += " comma";
                continue;
            }
        }
        out += c;
    }
    return out;
}

/**
 * Maths as Typst. The nodes are printed back to LaTeX for tex2typst, with the
 * commands it cannot handle replaced by placeholders that are converted here.
 */
function math(nodes: Ast.Node[], ctx: MathCtx): string {
    const pieces: string[] = [];
    const placeholder = (typst: string) => {
        pieces.push(typst);
        return `\\text{ZQPH${pieces.length - 1}Q}`;
    };
    // In `display(..)` a comma would separate arguments: write top-level
    // commas as `comma`, as tex2typst does.
    const wrapDisplay = (s: string) =>
        ctx.display ? `display(${topLevelCommas(s)})` : s;

    const toLatex = (list: Ast.Node[]): string => {
        let out = "";
        for (let i = 0; i < list.length; i++) {
            const node = list[i];
            if (isMacro(node, "displaystyle")) {
                ctx = { display: true };
                out += "\\displaystyle ";
                continue;
            }
            if (isMacro(node, "color")) {
                // A declaration: colours the rest of the group.
                const color = COLORS[printRaw(mandatory(node)[0] ?? []).trim()];
                const rest = list.slice(i + 1);
                const inner = math(rest, { ...ctx });
                out += placeholder(
                    color
                        ? `#text(fill: ${color})[$${wrapDisplay(inner)}$]`
                        : todo(`colour ${printRaw(node)}`)
                );
                break;
            }
            if (node.type === "macro" && node.content in SIZES) {
                // A size declaration: sizes the rest of the group.
                const inner = math(list.slice(i + 1), { ...ctx });
                out += placeholder(
                    `#text(size: ${SIZES[node.content]})[$${wrapDisplay(
                        inner
                    )}$]`
                );
                break;
            }
            if (isMacro(node, "mathrlap")) {
                // Overlaps to the right, taking no width.
                out += placeholder(
                    `#box(width: 0pt)[$${math(mandatory(node)[0] ?? [], {
                        ...ctx,
                    })}$]`
                );
                continue;
            }
            if (isMacro(node, "boxed")) {
                // amsmath's \boxed sets its argument in display style.
                out += placeholder(
                    `#boxed[$${displayStyle(
                        math(mandatory(node)[0] ?? [], { display: true })
                    )}$]`
                );
                continue;
            }
            if (isMacro(node, "phantom")) {
                out += placeholder(
                    `#hide[$${wrapDisplay(
                        math(mandatory(node)[0] ?? [], { ...ctx })
                    )}$]`
                );
                continue;
            }
            if (isMacro(node, "DS")) {
                out += "\\displaystyle " + toLatex(mandatory(node)[0] ?? []);
                continue;
            }
            if (
                isMacro(node, "label") ||
                isMacro(node, "nonumber") ||
                isMacro(node, "notag")
            ) {
                continue;
            }
            if (
                (isMacro(node, "text") ||
                    isMacro(node, "mbox") ||
                    isMacro(node, "textbf") ||
                    isMacro(node, "emph") ||
                    isMacro(node, "textit")) &&
                hasMathOrMacro(mandatory(node)[0] ?? [])
            ) {
                // Text with maths or commands in it: convert it as text.
                const inner = text(mandatory(node)[0] ?? [], {
                    list: 0,
                }).trim();
                const wrapped =
                    node.content === "textbf"
                        ? `#strong[${inner}]`
                        : node.content === "text" || node.content === "mbox"
                        ? `#[${inner}]`
                        : `#emph[${inner}]`;
                out += placeholder(wrapped);
                continue;
            }
            if (isMacro(node, "mbox")) {
                out += "\\text{" + printRaw(mandatory(node)[0] ?? []) + "}";
                continue;
            }
            if (node.type === "group") {
                out += "{" + toLatex(node.content) + "}";
                continue;
            }
            if (node.type === "macro" && node.args?.length) {
                // Re-print the macro, converting its arguments recursively.
                // (`^` and `_` are macros with no escape token.)
                out += (node.escapeToken ?? "\\") + node.content;
                for (const a of node.args) {
                    if (!a.openMark) continue;
                    out += a.openMark + toLatex(a.content) + a.closeMark;
                }
                continue;
            }
            if (node.type === "environment" || node.type === "mathenv") {
                const name = printRaw(node.env);
                out +=
                    `\\begin{${name}}` +
                    printRaw(node.args ?? []) +
                    toLatex(node.content) +
                    `\\end{${name}}`;
                continue;
            }
            if (node.type === "comment") continue;
            out += printRaw(node);
        }
        return out;
    };

    const latex = toLatex(nodes)
        // tex2typst does not know `\vert` as a delimiter.
        .replace(/\\(left|right)\\vert(?![a-zA-Z])/g, "\\$1|")
        .replace(/\\vert(?![a-zA-Z])/g, "|")
        // Quotation marks typed inside maths, ``like this'' (but not the
        // primes of f''), as the characters themselves.
        .replace(/``([^`]*?)(''|")/g, "“$1”")
        // Negative thin spaces, LaTeX spacing tweaks Typst does not need.
        .replace(/\\!/g, "")
        // Norms typed as `||P||`.
        .replace(/\|\|/g, "\\Vert ")
        // Sizes of delimiters, which Typst sets by itself.
        .replace(/\\(big|Big|bigg|Bigg)[lrm]?(?![a-zA-Z])/g, "")
        // A line break at the end of inline maths.
        .replace(/\\+\s*$/, "")
        .trim();
    if (!latex) return "";
    let typst: string;
    try {
        typst = tex2typst(latex, {
            inftyToOo: true,
            customTexMacros: { "\\R": "\\mathbb{R}" },
        });
    } catch (e) {
        return todo(`maths ${latex}`);
    }
    typst = casesSpacing(
        absoluteValues(
            typst.replace(/\|\s*\|\s*([^|]+?)\s*\|\s*\|/g, "norm($1)")
        )
    );
    // Splice the placeholders back in (they may nest).
    for (let k = 0; k < 5 && /ZQPH\d+Q/.test(typst); k++) {
        typst = typst.replace(
            /upright\("ZQPH(\d+)Q"\)|"ZQPH(\d+)Q"|#?ZQPH(\d+)Q/g,
            (_, a, b, c) => pieces[Number(a ?? b ?? c)]
        );
    }
    return typst;
}

/**
 * Bars that come in pairs within one bracket level, `| x - a |`, as
 * `abs(x - a)`: Typst spaces a bare `|` as a relation. A level with an odd
 * number of bars (an evaluation bar, "such that") is left alone.
 */
function absoluteValues(s: string): string {
    // `ln |x| \right|` arrives as `lr(ln | x ||)`: two bars, not a double one.
    s = s.replace(/\|\|(\s*\))/g, "| |$1");
    type Group = { bars: number[]; lr: boolean };
    const pairs: [number, number][] = [];
    const stack: Group[] = [{ bars: [], lr: false }];
    let inString = false;
    const close = (g: Group, end: number) => {
        // The closing bar of `lr(.. |)` is an evaluation bar, not half of a pair.
        const last = g.bars[g.bars.length - 1];
        if (g.lr && g.bars.length % 2 === 1 && !s.slice(last + 1, end).trim())
            g.bars.pop();
        if (g.bars.length >= 2 && g.bars.length % 2 === 0) {
            for (let k = 0; k < g.bars.length; k += 2) {
                // Not `||`, and something between the bars.
                if (s.slice(g.bars[k] + 1, g.bars[k + 1]).trim())
                    pairs.push([g.bars[k], g.bars[k + 1]]);
            }
        }
    };
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '"' && s[i - 1] !== "\\") inString = !inString;
        if (inString || s[i - 1] === "\\") continue;
        if ("([{".includes(c))
            stack.push({
                bars: [],
                lr: c === "(" && s.slice(i - 2, i) === "lr",
            });
        else if (")]}".includes(c) && stack.length > 1) close(stack.pop()!, i);
        else if (
            c === "|" &&
            s[i - 1] !== "\\" &&
            s[i - 1] !== "|" &&
            s[i + 1] !== "|"
        ) {
            // A bar with limits, `|_a^b`, is an evaluation bar.
            if (!/^\s*[_^]/.test(s.slice(i + 1)))
                stack[stack.length - 1].bars.push(i);
        }
    }
    close(stack[0], s.length);
    // Mark the bars in place (keeping every position valid), then expand.
    const chars = s.split("");
    for (const [a, b] of pairs) {
        chars[a] = "\u0002";
        chars[b] = "\u0003";
    }
    return chars
        .join("")
        .replace(/\u0002\s*/g, "abs(")
        .replace(/\s*\u0003/g, ")");
}

/** Whether the nodes (looking into groups) have maths or a command. */
function hasMathOrMacro(nodes: Ast.Node[]): boolean {
    return nodes.some(
        (n) =>
            n.type === "inlinemath" ||
            n.type === "macro" ||
            (n.type === "group" && hasMathOrMacro(n.content))
    );
}

/**
 * A quad after each column separator of `cases(..)`: LaTeX's cases put one
 * between the value and its condition, Typst's do not.
 */
function casesSpacing(s: string): string {
    let out = "";
    let i = 0;
    while (i < s.length) {
        const start = s.indexOf("cases(", i);
        if (start < 0) break;
        out += s.slice(i, start + 6);
        let depth = 1;
        let j = start + 6;
        for (; j < s.length && depth > 0; j++) {
            const c = s[j];
            if (s[j - 1] !== "\\" && "([{".includes(c)) depth++;
            if (s[j - 1] !== "\\" && ")]}".includes(c)) depth--;
            out += c === "&" && depth === 1 && s[j - 1] !== "\\" ? "& quad" : c;
        }
        i = j;
    }
    return out + s.slice(i);
}

/** Typst maths in display style (once: tex2typst may have wrapped it already). */
function displayStyle(s: string): string {
    return !s || s.startsWith("display(") ? s : `display(${topLevelCommas(s)})`;
}

/** Inline maths, `$..$`. */
function inlineMath(nodes: Ast.Node[]): string {
    const s = math(nodes, { display: false });
    return s ? `$${s}$` : "";
}
/** Display maths, `$ .. $` on its own lines. */
function displayMath(nodes: Ast.Node[], aligned = false): string {
    // `align*` becomes tex2typst's `aligned`.
    const content: Ast.Node[] = aligned
        ? [
              {
                  type: "environment",
                  env: "aligned",
                  content: nodes,
              } as Ast.Environment,
          ]
        : nodes;
    const s = math(content, { display: true });
    return s ? `\n$\n  ${s.replace(/\n/g, "\n  ")}\n$\n` : "";
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

type Ctx = { list: number };

/** Declarations that apply to the rest of the group they are in. */
function declaration(list: Ast.Node[], i: number, ctx: Ctx): string | null {
    const node = list[i];
    if (node.type !== "macro") return null;
    const rest = () => text(list.slice(i + 1), ctx);
    switch (node.content) {
        case "color": {
            const name = printRaw(mandatory(node)[0] ?? []).trim();
            const color = COLORS[name];
            return color
                ? `#text(fill: ${color})${block(rest())}`
                : todo(`colour ${name}`) + rest();
        }
        case "bfseries":
        case "bf":
            return `#strong${block(rest())}`;
        case "itshape":
        case "em":
        case "it":
            return `#emph${block(rest())}`;
        case "fontsize":
            return (
                `#set text(size: ${printRaw(
                    mandatory(node)[0] ?? []
                ).trim()}pt)\n` + rest()
            );
        case "centering":
            return `#align(center)${block(rest())}`;
    }
    if (node.content in SIZES) {
        return `#set text(size: ${SIZES[node.content]})\n` + rest();
    }
    return null;
}

/** Whether the content has a declaration that needs a scope of its own. */
function hasDeclaration(nodes: Ast.Node[]): boolean {
    return nodes.some(
        (n) =>
            n.type === "macro" &&
            (n.content === "fontsize" || n.content in SIZES)
    );
}

function text(nodes: Ast.Node[], ctx: Ctx): string {
    let out = "";
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const decl = declaration(nodes, i, ctx);
        if (decl !== null) {
            out += decl;
            break;
        }
        // No space at the start of a line.
        if (node.type === "whitespace" && (out === "" || out.endsWith("\n")))
            continue;
        out += textNode(node, ctx, nodes, i);
    }
    return out;
}

function textNode(
    node: Ast.Node,
    ctx: Ctx,
    siblings: Ast.Node[],
    index: number
): string {
    switch (node.type) {
        case "string":
            return escapeText(
                node.content
                    .replace(/``/g, "“")
                    .replace(/''/g, "”")
                    .replace(/`/g, "‘")
            );
        case "whitespace":
            return " ";
        case "parbreak":
            return "\n\n";
        case "comment":
            return "";
        case "group": {
            const inner = text(node.content, ctx);
            return hasDeclaration(node.content) ? `#${block(inner)}` : inner;
        }
        case "inlinemath":
            return inlineMath(node.content);
        case "displaymath":
            return displayMath(node.content);
        case "mathenv": {
            const name = printRaw(node.env);
            const label = node.content.find((n) => isMacro(n, "label")) as
                | Ast.Macro
                | undefined;
            if (name === "equation" && label) {
                // A numbered equation, for an \eqref to refer to.
                const s = math(node.content, { display: true });
                return `\n#math.equation(block: true, numbering: "(1)", $ ${s} $) <${printRaw(
                    mandatory(label)[0] ?? []
                ).trim()}>\n`;
            }
            return displayMath(node.content, name.startsWith("align"));
        }
        case "environment":
            return environment(node, ctx);
        case "macro":
            return macro(node, ctx, siblings, index);
        case "verbatim":
        case "verb":
            return "`" + node.content + "`";
    }
    return todo(`node ${printRaw(node)}`);
}

function macro(
    node: Ast.Macro,
    ctx: Ctx,
    siblings: Ast.Node[],
    index: number
): string {
    const m = mandatory(node);
    const first = () => text(m[0] ?? [], ctx);
    switch (node.content) {
        case "\\": {
            // A line break; dropped at the end of a paragraph.
            const next = siblings
                .slice(index + 1)
                .find((n) => n.type !== "whitespace" && n.type !== "comment");
            if (!next || next.type === "parbreak") return "";
            return " \\\n";
        }
        case "emph":
        case "textit":
            return `#emph[${first().trim()}]`;
        case "textbf":
            return `#strong[${first().trim()}]`;
        case "underline":
            return `#underline[${first().trim()}]`;
        case "mbox":
        case "text":
            return first();
        case "phantom":
            return `#hide[${first()}]`;
        case "boxed":
            // amsmath's \boxed sets its argument as display maths, even in text.
            return `#boxed[$${displayStyle(
                math(m[0] ?? [], { display: true })
            )}$]`;
        case "DS":
            return `$${math(m[0] ?? [], { display: true }).replace(
                /^(?!display\()(.*)$/s,
                "display($1)"
            )}$`;
        case "vspace": {
            // Negative space tightened LaTeX's generous spacing around
            // displays and lists; Typst's is tight already.
            const len = length(m[0] ?? []);
            return len.startsWith("-") ? "\n" : `\n#v(${len})\n`;
        }
        case "vfill":
            return "\n#v(1fr)\n";
        case "hfill":
            return "#h(1fr)";
        case "medskip":
            return "\n#v(.5em)\n";
        case "smallskip":
            return "\n#v(.25em)\n";
        case "bigskip":
            return "\n#v(1em)\n";
        case "quad":
            return "#h(1em)";
        case "qquad":
            return "#h(2em)";
        case ",":
            return "#h(.17em)";
        case ";":
        case ":":
            return "#h(.25em)";
        case " ":
        case "\n":
            return " ";
        case "noindent":
        case "selectfont":
        case "label":
        case "par":
            return "";
        case "pause":
            return "\n#pause\n";
        case "only": {
            const overlay = printRaw(
                (node.args ?? []).find((a) => a.openMark === "<")?.content ?? []
            );
            return `#only(${JSON.stringify(overlay)})${block(
                text(m[0] ?? [], ctx)
            )}`;
        }
        case "includegraphics":
            return graphic(node);
        case "href":
            return `#link(${JSON.stringify(printRaw(m[0] ?? []))})[${text(
                m[1] ?? [],
                ctx
            )}]`;
        case "hyperlink":
            return text(m[1] ?? [], ctx);
        case "beamergotobutton":
            return `#goto-button[${first()}]`;
        case "hrulefill":
            return "#box(width: 1fr, line(length: 100%, stroke: .5pt))";
        case "columnbreak":
            return "\n#colbreak()\n";
        case "ldots":
        case "dots":
            return "...";
        case "%":
        case "&":
        case "$":
        case "#":
        case "_":
            return escapeText(node.content);
        case "eqref":
            // Shown as "(1)", as LaTeX does.
            return `(#ref(<${printRaw(m[0] ?? []).trim()}>, supplement: none))`;
        case "ref":
            return todo(`reference ${printRaw(node)}`);
        case "item":
            return todo("stray \\item");
        case "qed":
            return "#h(1fr) $square$";
    }
    // A maths command typed in text (LaTeX would have complained, but these
    // come out of a \boxed or similar): set it as maths.
    try {
        const typst = tex2typst(printRaw(node), { inftyToOo: true });
        if (typst && !/^"/.test(typst)) return `$${typst}$`;
    } catch {}
    return todo(`macro ${printRaw(node)}`);
}

function graphic(node: Ast.Macro): string {
    const name = printRaw(mandatory(node)[0] ?? [])
        .trim()
        .replace(/\.(png|pdf|svg)$/, "");
    const opts = printRaw(optional(node) ?? []);
    const args: string[] = [];
    const scale = opts.match(/scale\s*=\s*([\d.]+)/);
    const width = opts.match(/width\s*=\s*([^,]+)/);
    const height = opts.match(/height\s*=\s*([^,]+)/);
    if (scale)
        args.push(
            `width: ${Math.round(parseFloat(scale[1]) * IMAGE_WIDTH_MM)}mm`
        );
    if (width)
        args.push(
            `width: ${length([
                { type: "string", content: width[1] } as Ast.String,
            ])}`
        );
    if (height)
        args.push(
            `height: ${length([
                { type: "string", content: height[1] } as Ast.String,
            ])}`
        );
    // The images are drawn in Typst, in the questions (see typst-sources).
    return todo(
        `draw ${name} (website/public/slide-images) here: ` +
            `#drawing(${[...args, "function-graph(..)"].join(", ")})`
    );
}

// ---------------------------------------------------------------------------
// Environments
// ---------------------------------------------------------------------------

function environment(node: Ast.Environment, ctx: Ctx): string {
    const name = printRaw(node.env);
    const m = mandatory(node);
    switch (name) {
        case "enumerate":
        case "itemize":
            return list(node, ctx);
        case "center":
            return `\n#align(center)${block(text(node.content, ctx))}\n`;
        case "block": {
            const title = text(m[0] ?? [], ctx).trim();
            return `\n#slide-block(${title ? `title: [${title}]` : ""})${block(
                text(node.content, ctx)
            )}\n`;
        }
        case "multicols":
            return multicols(node, ctx);
        case "columns":
            return columns(node, ctx);
        case "tabular":
            return tabular(node, ctx);
        case "minipage":
            return `#box(width: ${length(m[0] ?? [])})${block(
                text(node.content, ctx)
            )}`;
        case "theorem": {
            const opt = optional(node);
            return `\n#theorem(${
                opt ? `title: [${text(opt, ctx)}]` : ""
            })${block(text(node.content, ctx))}\n`;
        }
        case "proof":
            return `\n#proof${block(text(node.content, ctx))}\n`;
        case "quote":
            return `\n#quote(block: true)${block(text(node.content, ctx))}\n`;
        case "tikzpicture":
            // Kept as line comments, to be redrawn by hand.
            return (
                "\n" +
                todo("TikZ picture") +
                "\n" +
                printRaw(node)
                    .split("\n")
                    .map((l) => "// " + l)
                    .join("\n") +
                "\n"
            );
    }
    return todo(`environment ${name}`) + text(node.content, ctx);
}

/** Split a list's content into its items, and what comes before them. */
function items(content: Ast.Node[]): {
    before: Ast.Node[];
    items: Ast.Node[][];
} {
    const before: Ast.Node[] = [];
    const result: Ast.Node[][] = [];
    for (const n of content) {
        if (isMacro(n, "item")) {
            // unified-latex gives an item its body as its last argument.
            result.push([...(n.args?.[n.args.length - 1]?.content ?? [])]);
            continue;
        }
        if (result.length === 0) before.push(n);
        else result[result.length - 1].push(n);
    }
    return { before, items: result };
}

/** Strip blanks from both ends. */
function trimNodes(nodes: Ast.Node[]): Ast.Node[] {
    let a = 0;
    let b = nodes.length;
    while (a < b && isBlank(nodes[a])) a++;
    while (b > a && isBlank(nodes[b - 1])) b--;
    return nodes.slice(a, b);
}

/**
 * Typst list markup for a run of items, numbered from `start` (enumerate) or
 * bulleted (itemize). An item of an enumerate is `+`, numbered by Typst,
 * where that is its number: its number is written out only where Typst's
 * would differ, after a `#v(1fr)` (which ends a list), in a list that starts
 * after 1 (one split by columns) or after an `\addtocounter`.
 */
function listMarkup(
    itemNodes: Ast.Node[][],
    numbered: boolean,
    start: number,
    ctx: Ctx
): { markup: string; next: number } {
    let n = start;
    let out = "";
    // Whether Typst would number the next item `n` by itself.
    let counted = n === 1;
    for (let k = 0; k < itemNodes.length; k++) {
        let content = trimNodes(itemNodes[k]);
        // Counter changes inside an item apply to the next one.
        let bump = 0;
        content = content.filter((c) => {
            if (isMacro(c, "addtocounter")) {
                bump += parseInt(printRaw(mandatory(c)[1] ?? []), 10) || 0;
                return false;
            }
            return true;
        });
        content = trimNodes(content);
        // A \vfill at the end of an item spreads the list out: it goes between
        // the items, where `#v(1fr)` can stretch.
        let after = "";
        while (
            content.length &&
            isMacro(content[content.length - 1], "vfill")
        ) {
            after = "\n#v(1fr)\n";
            content = trimNodes(content.slice(0, -1));
        }
        const marker = !numbered ? "-" : counted ? "+" : `${n}.`;
        const body = text(content, { list: ctx.list + 1 })
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        out += `${MARKER}${marker} ${indent(
            body,
            " ".repeat(marker.length + 1)
        ).trimStart()}\n`;
        out += after;
        n += 1 + bump;
        counted = !after && bump === 0;
    }
    return { markup: out, next: n };
}

/**
 * A list. Some lists have part of their items inside a `multicols`: each part
 * is converted in turn, the numbering running on.
 */
function list(node: Ast.Environment, ctx: Ctx): string {
    const numbered = printRaw(node.env) === "enumerate";
    const parts: string[] = [];
    let n = 1;
    let pending: Ast.Node[] = [];
    const flush = () => {
        if (!trimNodes(pending).length) return;
        const { before, items: itemNodes } = items(pending);
        n += counterBump(before);
        const setup = before.filter(
            (x) =>
                !isBlank(x) &&
                !isMacro(x, "setlength") &&
                !isMacro(x, "addtocounter")
        );
        const result = listMarkup(itemNodes, numbered, n, ctx);
        n = result.next;
        // Declarations before the first item apply to the whole list.
        parts.push(
            setup.length
                ? `#${block(text(setup, ctx).trim() + "\n" + result.markup)}`
                : result.markup
        );
        pending = [];
    };
    // A `multicols` of items at the end of an item's body (where the parser
    // puts it) is lifted out of that item.
    const content: Ast.Node[] = [];
    for (const c of node.content) {
        const body = isMacro(c, "item")
            ? c.args?.[c.args.length - 1]?.content ?? []
            : [];
        const k = body.findIndex(
            (b) =>
                isEnv(b, "multicols") &&
                b.content.some((x) => isMacro(x, "item"))
        );
        if (isMacro(c, "item") && k >= 0) {
            const args = c.args!;
            content.push(
                {
                    ...c,
                    args: [
                        ...args.slice(0, -1),
                        { ...args[args.length - 1], content: body.slice(0, k) },
                    ],
                },
                ...body.slice(k)
            );
        } else {
            content.push(c);
        }
    }
    for (const c of content) {
        if (isEnv(c, "multicols")) {
            flush();
            const cols = parseInt(printRaw(mandatory(c)[0] ?? []), 10) || 2;
            const { before, items: itemNodes } = items(c.content);
            const result = columnList(
                cols,
                numbered,
                before,
                itemNodes,
                ctx,
                n
            );
            n = result.next;
            parts.push(result.markup);
        } else {
            pending.push(c);
        }
    }
    flush();
    return `\n${parts.join("\n")}\n`;
}

/** `multicols`: a list is split evenly over the columns, as LaTeX balances them. */
function multicols(node: Ast.Environment, ctx: Ctx): string {
    const n = parseInt(printRaw(mandatory(node)[0] ?? []), 10) || 2;
    const content = trimNodes(node.content).filter((c) => !isBlank(c));
    const lists = content.filter(
        (c) => isEnv(c, "enumerate") || isEnv(c, "itemize")
    );
    if (lists.length === 1 && content.length === 1) {
        const env = lists[0] as Ast.Environment;
        const { before, items: itemNodes } = items(env.content);
        return columnList(
            n,
            printRaw(env.env) === "enumerate",
            before,
            itemNodes,
            ctx
        ).markup;
    }
    return `\n// TODO: check the column breaks (LaTeX balances multicols; Typst does not).\n#columns(${n})${block(
        text(node.content, ctx)
    )}\n`;
}

/** The total of the `\addtocounter{enumi}{..}`s among the nodes. */
function counterBump(nodes: Ast.Node[]): number {
    return nodes
        .filter((n) => isMacro(n, "addtocounter"))
        .reduce(
            (sum, n) =>
                sum +
                (parseInt(printRaw(mandatory(n as Ast.Macro)[1] ?? []), 10) ||
                    0),
            0
        );
}

/**
 * A list split evenly over `n` columns, numbered from `start`; with the
 * number of the item after it.
 */
function columnList(
    n: number,
    numbered: boolean,
    before: Ast.Node[],
    itemNodes: Ast.Node[][],
    ctx: Ctx,
    start = 1
): { markup: string; next: number } {
    const per = Math.ceil(itemNodes.length / n);
    const cols: string[] = [];
    start += counterBump(before);
    before = before.filter((x) => !isMacro(x, "addtocounter"));
    for (let c = 0; c < n; c++) {
        const chunk = itemNodes.slice(c * per, (c + 1) * per);
        const { markup, next } = listMarkup(chunk, numbered, start, ctx);
        start = next;
        // On lines of its own: `[- item]` would not be a list.
        cols.push(`[\n${indent(markup.trim(), "  ")}\n]`);
    }
    const setup = before.filter((x) => !isBlank(x) && !isMacro(x, "setlength"));
    const grid = `#grid(\n  columns: ${n},\n  column-gutter: 1em,\n${cols
        .map((c) => indent(c, "  ") + ",")
        .join("\n")}\n)`;
    const markup =
        "\n" +
        (setup.length
            ? `#${block(text(setup, ctx).trim() + "\n" + grid)}`
            : grid) +
        "\n";
    return { markup, next: start };
}

/** Beamer `columns`, split by `\column{w}` or `column` environments. */
function columns(node: Ast.Environment, ctx: Ctx): string {
    const top = printRaw(optional(node) ?? []).includes("t");
    const widths: string[] = [];
    const bodies: Ast.Node[][] = [];
    for (const n of node.content) {
        if (isMacro(n, "column")) {
            widths.push(length(mandatory(n)[0] ?? []));
            bodies.push([]);
        } else if (isEnv(n, "column")) {
            widths.push(length(mandatory(n)[0] ?? []));
            bodies.push(n.content);
        } else if (bodies.length) {
            bodies[bodies.length - 1].push(n);
        }
    }
    const cells = bodies.map(
        (b) => indent(block(text(trimNodes(b), ctx)), "  ") + ","
    );
    return `\n#grid(\n  columns: (${widths.join(
        ", "
    )}),\n  column-gutter: 1fr,\n  align: ${
        top ? "top" : "horizon"
    },\n${cells.join("\n")}\n)\n`;
}

function tabular(node: Ast.Environment, ctx: Ctx): string {
    const spec = printRaw(mandatory(node)[0] ?? []).replace(/\s/g, "");
    const cols = spec.replace(/[^lcrp]/g, "").length;
    const aligns = spec
        .replace(/[^lcr]/g, "")
        .split("")
        .map((c) => ({ l: "left", c: "center", r: "right" }[c]));
    const ruled =
        spec.includes("|") || node.content.some((n) => isMacro(n, "hline"));
    // Split the content into rows (\\) and cells (&).
    const rows: Ast.Node[][][] = [[[]]];
    for (const n of node.content) {
        if (isMacro(n, "\\")) {
            rows.push([[]]);
        } else if (n.type === "string" && n.content === "&") {
            rows[rows.length - 1].push([]);
        } else if (isMacro(n, "hline") || isMacro(n, "cline")) {
            continue;
        } else {
            const row = rows[rows.length - 1];
            row[row.length - 1].push(n);
        }
    }
    // Rows of only spacing (`\vspace{..} \\`) are dropped; short rows are
    // padded, since a Typst table fills its cells in order.
    const cells = rows
        .map((r) => r.map((c) => text(trimNodes(c), ctx).trim()))
        .filter((r) => r.some((c) => c && !/^#v\([^)]*\)$/.test(c)))
        .map(
            (r) =>
                "  " +
                [...r, ...Array(Math.max(0, cols - r.length)).fill("")]
                    .map((c) => `[${c}]`)
                    .join(", ") +
                ","
        )
        .join("\n");
    return `\n// TODO: check the rules of this table against the LaTeX.\n#table(\n  columns: ${cols},\n  align: (${aligns.join(
        ", "
    )}${aligns.length === 1 ? "," : ""}),\n  stroke: ${
        ruled ? ".5pt" : "none"
    },\n${cells}\n)\n`;
}

// ---------------------------------------------------------------------------
// Frames
// ---------------------------------------------------------------------------

const parser = unified().use(unifiedLatexFromString, {
    macros: MACROS,
    environments: ENVIRONMENTS,
});

function parse(source: string): Ast.Root {
    return parser.runSync(parser.parse(source)) as Ast.Root;
}

/**
 * LaTeX quotes in text: ``x'' (which arrives as two single quotes) as “x”.
 * Inline maths, where '' is a double prime, is left alone.
 */
function textQuotes(line: string): string {
    return line
        .split(/(?<!\\)(\$[^$]*\$)/)
        .map((part) =>
            part.startsWith("$")
                ? part
                : part
                      .replace(/‘‘/g, "“")
                      .replace(/''/g, "”")
                      .replace(/``/g, "“")
        )
        .join("");
}

/** Marks the list markers listMarkup writes, until `tidy` removes it. */
const MARKER = "\u0001";

/**
 * Tidy the markup: blank lines and trailing spaces, and escape text that
 * would read as markup at the start of a line (a heading `=`, a term `/`, or
 * a list marker that is not one of ours). Display maths is left alone.
 */
function tidy(s: string): string {
    let inMath = false;
    return s
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .split("\n")
        .map((line) => {
            if (line.trim() === "$") inMath = !inMath;
            if (inMath) return line;
            if (line.trimStart().startsWith("//")) return line;
            line = textQuotes(line);
            if (line.trimStart().startsWith(MARKER))
                return line.replace(MARKER, "");
            return line.replace(
                /^(\s*)(?=[=\/]|[-+](?:\s|$)|\d+\.(?:\s|$))/,
                "$1\\"
            );
        })
        .join("\n")
        .trim();
}

export function convertFrame(frame: string): string {
    // One frame begins with a garbled `\mallnegin{frame}`.
    frame = frame
        .replace(/^\\mallnegin\{frame\}/, "\\begin{frame}")
        // `\begin {enumerate}` (with a space) in unit 3.
        .replace(/\\(begin|end)\s+\{/g, "\\$1{")
        // Accents, as in L'H\^opital: the letter with a combining mark.
        .replace(
            /\\([\^'`"~])\{?([a-zA-Z])\}?/g,
            (_, accent: string, letter: string) =>
                (
                    letter +
                    (
                        {
                            "^": "\u0302",
                            "'": "\u0301",
                            "`": "\u0300",
                            '"': "\u0308",
                            "~": "\u0303",
                        } as Record<string, string>
                    )[accent]
                ).normalize("NFC")
        );
    const root = parse(frame);
    const env = root.content.find((n) => isEnv(n, "frame")) as
        | Ast.Environment
        | undefined;
    if (!env) throw new Error("no frame");
    const opt = printRaw(optional(env) ?? []);
    const centered = !opt.includes("t");
    const titleNode = env.content.find((n) => isMacro(n, "frametitle")) as
        | Ast.Macro
        | undefined;
    const title = titleNode
        ? text(mandatory(titleNode)[0] ?? [], { list: 0 }).trim()
        : "";
    const body = env.content.filter((n) => n !== titleNode);
    const markup = tidy(text(trimNodes(body), { list: 0 }));
    const args = [`title: [${title}]`, ...(centered ? ["centered: true"] : [])];
    return `#question(${args.join(", ")})[\n${indent(markup, "  ")}\n]\n`;
}

async function main() {
    const argv = process.argv.slice(2);
    const force = argv.includes("--force");
    const units = argv.filter((a) => /^\d+$/.test(a)).map(Number);
    const questions: { unit: number; question: number; frame: string }[] =
        JSON.parse(await fs.readFile(QUESTIONS, "utf8"));
    let written = 0;
    for (const q of questions) {
        if (units.length && !units.includes(q.unit)) continue;
        const file = path.join(
            OUT_DIR,
            `unit-${String(q.unit).padStart(2, "0")}`,
            `q${String(q.question).padStart(2, "0")}.typ`
        );
        if (!force) {
            try {
                await fs.access(file);
                continue;
            } catch {}
        }
        const before = todos.length;
        let typst: string;
        try {
            typst = convertFrame(q.frame);
        } catch (e) {
            typst = `// TODO: conversion failed: ${(e as Error).message}\n/*\n${
                q.frame
            }\n*/\n`;
            todos.push("failed");
        }
        if (todos.length > before) {
            console.log(
                `unit ${q.unit} q${q.question}: ${todos
                    .slice(before)
                    .join("; ")}`
            );
        }
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, typst);
        written++;
    }
    console.log(`Wrote ${written} files; ${todos.length} TODOs.`);
}

await main();
