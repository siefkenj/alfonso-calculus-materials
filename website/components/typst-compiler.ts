"use client";
// Typst in the browser (typst.ts, https://github.com/Myriad-Dreamin/typst.ts),
// for the live editor: loaded once, and only when the editor is first opened
// (the compiler is about 10 MB compressed). Its WebAssembly comes from
// jsDelivr, as does typst.ts's set of default fonts; the slide fonts are the
// site's own (public/typst/fonts), and Touying and CeTZ are fetched from
// packages.typst.org.
//
// typst.ts 0.8 is the first to bundle Typst 0.15, which Touying 0.8 needs; its
// version must match @myriaddreamin/typst-ts-node-compiler, which renders the
// previews (typst-sources/build.ts), and the typst.ts packages, which are
// pinned to it in package.json.
import type { TypstBundle } from "./typst-document";
import { basePath, once } from "./site";

const TYPST_TS = "0.8.0-rc4";
const CDN = "https://cdn.jsdelivr.net/npm/@myriaddreamin";

/** The slide fonts, in public/typst/fonts. */
const FONTS = [
    "NewCMSans10-Regular.otf",
    "NewCMSans10-Bold.otf",
    "NewCMSans10-Oblique.otf",
    "NewCMSans10-BoldOblique.otf",
    "NewCMSansMath-Regular.otf",
];

type Snippet = typeof import("@myriaddreamin/typst.ts/contrib/snippet").$typst;

let loaded = false;

/** Whether the compiler has finished loading (for a "Loading..." message). */
export function isTypstLoaded(): boolean {
    return loaded;
}

/**
 * The compiler, loaded once. Each attempt has a compiler of its own (not
 * typst.ts's shared `$typst`), so that one that failed leaves nothing behind
 * for the next.
 */
export const loadTypst = once(async (): Promise<Snippet> => {
    const { TypstSnippet } = await import(
        "@myriaddreamin/typst.ts/contrib/snippet"
    );
    const $typst = new TypstSnippet();
    $typst.setCompilerInitOptions({
        getModule: () =>
            `${CDN}/typst-ts-web-compiler@${TYPST_TS}/pkg/typst_ts_web_compiler_bg.wasm`,
    });
    $typst.setRendererInitOptions({
        getModule: () =>
            `${CDN}/typst-ts-renderer@${TYPST_TS}/pkg/typst_ts_renderer_bg.wasm`,
    });
    const site = new URL(`${basePath}/typst/fonts/`, window.location.href);
    $typst.use(
        TypstSnippet.preloadFonts(
            FONTS.map((font) => new URL(font, site).href)
        ),
        // Fonts count as an "access model" to typst.ts, which then no
        // longer adds the package registry by itself.
        TypstSnippet.fetchPackageRegistry()
    );
    // Compile something, so that a failure shows here, once.
    await $typst.svg({ mainContent: "" });
    loaded = true;
    return $typst;
});

/** One compilation at a time: typst.ts shares one compiler. */
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(job: () => Promise<T>): Promise<T> {
    const run = queue.then(job);
    queue = run.catch(() => {});
    return run;
}

/** A compilation not done, as no longer wanted (see `compileSvg`). */
export class Superseded extends Error {
    constructor() {
        super("Superseded by a newer compilation");
    }
}

/**
 * The slide(s) of a document as SVG, every `#pause`d part shown. If `stale`
 * says so when its turn comes (the document has been edited since, while
 * another compiled), it is not compiled: it fails with `Superseded`.
 */
export function compileSvg(
    document: string,
    stale?: () => boolean
): Promise<string> {
    return exclusive(async () => {
        if (stale?.()) throw new Superseded();
        return (await loadTypst()).svg({
            mainContent: document,
            inputs: { handout: "true" },
        });
    });
}

/**
 * An SVG of `compileSvg`'s as a file of its own, which an <img> can show: it
 * is made to be put in a page, so it may lack the namespaces a file needs, and
 * has scripts (for selecting its text) that are not well-formed XML, which an
 * <img> would not run anyway.
 */
export function standaloneSvg(svg: string): string {
    svg = svg.replace(/<script\b[\s\S]*?<\/script>/g, "");
    svg = svg.replace(
        /<svg\b(?![^>]*\bxmlns=)/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
    );
    if (svg.includes("xlink:") && !svg.includes("xmlns:xlink")) {
        svg = svg.replace(
            /<svg\b/,
            '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
    }
    return svg;
}

/** A document as PDF, with its `#pause`s as separate slides. */
export function compilePdf(document: string): Promise<Uint8Array> {
    return exclusive(async () => {
        const pdf = await (await loadTypst()).pdf({ mainContent: document });
        if (!pdf) throw new Error("Typst made no PDF");
        return pdf;
    });
}

/** A compiler error as text: typst.ts reports diagnostics in several shapes. */
export function describeError(error: unknown): string {
    if (Array.isArray(error)) return error.map(describeError).join("\n");
    const text =
        error instanceof Object && "message" in error
            ? String(error.message)
            : String(error);
    // Diagnostics arrive as Rust's debug output of `SourceDiagnostic`s.
    const messages = [...text.matchAll(/message: "((?:[^"\\]|\\.)*)"/g)].map(
        (m) => m[1].replace(/\\n/g, "\n").replace(/\\(.)/g, "$1")
    );
    return messages.length ? messages.join("\n") : text;
}

/** The site's Typst bundle (public/typst/questions.json), fetched once. */
export const loadTypstBundle = once(async (): Promise<TypstBundle> => {
    const r = await fetch(`${basePath}/typst/questions.json`);
    if (!r.ok) {
        throw new Error(`Could not load the Typst questions (${r.status})`);
    }
    return r.json();
});
