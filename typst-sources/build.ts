/**
 * Builds the Typst side of the site from this directory:
 *
 * - website/public/typst/questions.json: the template, the definitions the
 *   questions share (function-graph.typ) and every question's source, for
 *   the site's downloads, source views and editor;
 * - website/public/typst/slides/unit-NN-question-N.svg: each question's
 *   preview, rendered with the fonts in website/public/typst/fonts.
 *
 * It reports questions that do not compile and those that overflow their
 * slide (they run onto a second page), and fails if any do not compile,
 * unless given `--keep-going` (as `npm run dev` does, so that the site can
 * still be worked on). Previews are not rendered again unless their
 * document, the fonts or the compiler have changed.
 *
 * Run from the repository root:
 *   npx vite-node typst-sources/build.ts [--no-previews] [--keep-going]
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import {
    typstDocument,
    type TypstBundle,
} from "../website/components/typst-document";
import { questionName } from "../website/components/site";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCES = path.join(ROOT, "typst-sources");
const PUBLIC = path.join(ROOT, "website/public");
const OUT = path.join(PUBLIC, "typst");
const SLIDES = path.join(OUT, "slides");

/**
 * The definitions the questions share, by name: `function-graph`, which
 * draws their graphs (and `graph-fn` and the rest, which come with it).
 */
async function loadHelpers(): Promise<TypstBundle["helpers"]> {
    const file = path.join(SOURCES, "function-graph.typ");
    return { "function-graph": (await fs.readFile(file, "utf8")).trim() };
}

async function loadQuestions(): Promise<TypstBundle["questions"]> {
    const questions: TypstBundle["questions"] = [];
    const dir = path.join(SOURCES, "questions");
    for (const unitDir of (await fs.readdir(dir)).sort()) {
        const unit = Number(unitDir.match(/^unit-(\d+)$/)?.[1]);
        if (!unit) continue;
        for (const file of (await fs.readdir(path.join(dir, unitDir))).sort()) {
            const question = Number(file.match(/^q(\d+)\.typ$/)?.[1]);
            if (Number.isNaN(question)) continue;
            const typst = await fs.readFile(
                path.join(dir, unitDir, file),
                "utf8"
            );
            questions.push({ unit, question, typst });
        }
    }
    return questions;
}

function hash(s: string | Buffer): string {
    return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
}

/**
 * What a preview depends on besides its document: the compiler's version and
 * the fonts. Part of each preview's key, so that a change to either renders
 * them all again.
 */
async function renderingKey(): Promise<string> {
    const compiler = JSON.parse(
        await fs.readFile(
            path.join(
                ROOT,
                "node_modules/@myriaddreamin/typst-ts-node-compiler/package.json"
            ),
            "utf8"
        )
    );
    const fontsDir = path.join(OUT, "fonts");
    const fonts = await Promise.all(
        (await fs.readdir(fontsDir))
            .sort()
            .map(
                async (font) =>
                    `${font}:${hash(
                        await fs.readFile(path.join(fontsDir, font))
                    )}`
            )
    );
    return hash([compiler.version, ...fonts].join("\n"));
}

async function main() {
    const previews = !process.argv.includes("--no-previews");
    const keepGoing = process.argv.includes("--keep-going");
    const bundle: TypstBundle = {
        template: await fs.readFile(path.join(SOURCES, "template.typ"), "utf8"),
        helpers: await loadHelpers(),
        questions: await loadQuestions(),
    };
    await fs.mkdir(SLIDES, { recursive: true });
    // Written whole, then put in place: `next dev` reads it as it changes.
    const bundleFile = path.join(OUT, "questions.json");
    await fs.writeFile(`${bundleFile}.tmp`, JSON.stringify(bundle));
    await fs.rename(`${bundleFile}.tmp`, bundleFile);
    console.log(
        `Wrote ${bundle.questions.length} questions to ${path.relative(
            ROOT,
            OUT
        )}/questions.json`
    );
    if (!previews) return;

    const manifestFile = path.join(SLIDES, "manifest.json");
    const manifest: Record<string, string> = JSON.parse(
        await fs.readFile(manifestFile, "utf8").catch(() => "{}")
    );
    const compiler = NodeCompiler.create({
        workspace: SOURCES,
        fontArgs: [{ fontPaths: [path.join(OUT, "fonts")] }],
        inputs: { handout: "true" },
    });
    const rendering = await renderingKey();
    const failed: string[] = [];
    const overflowing: string[] = [];
    let rendered = 0;
    for (const q of bundle.questions) {
        const id = questionName(q.unit, q.question);
        const doc = typstDocument(bundle, [q.typst]);
        const key = hash(rendering + doc);
        const svgFile = path.join(SLIDES, `${id}.svg`);
        if (
            manifest[id]?.startsWith(key) &&
            (await fs.stat(svgFile).catch(() => null))
        ) {
            if (manifest[id].endsWith("+")) overflowing.push(id);
            continue;
        }
        const result = compiler.compile({ mainFileContent: doc });
        const document = result.result;
        if (!document || result.hasError()) {
            const error = result.takeDiagnostics() ?? result.takeError();
            // No preview, rather than one that is not of the source.
            await fs.rm(svgFile, { force: true });
            failed.push(
                `${id}: ${
                    error
                        ? JSON.stringify(compiler.fetchDiagnostics(error))
                        : "unknown error"
                }`
            );
            delete manifest[id];
            continue;
        }
        const pages = document.numOfPages;
        if (pages > 1) overflowing.push(id);
        await fs.writeFile(svgFile, compiler.plainSvg(document));
        manifest[id] = key + (pages > 1 ? "+" : "");
        rendered++;
    }
    // The previews of questions that are no longer there.
    const ids = new Set(
        bundle.questions.map((q) => questionName(q.unit, q.question))
    );
    for (const file of await fs.readdir(SLIDES)) {
        const id = file.replace(/\.svg$/, "");
        if (file.endsWith(".svg") && !ids.has(id)) {
            await fs.rm(path.join(SLIDES, file));
            console.log(`Removed ${file}, of no question.`);
        }
    }
    for (const id of Object.keys(manifest)) {
        if (!ids.has(id)) delete manifest[id];
    }
    await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 1));
    console.log(
        `Rendered ${rendered} previews (${
            bundle.questions.length - rendered - failed.length
        } unchanged).`
    );
    if (overflowing.length) {
        console.log(
            `\n${
                overflowing.length
            } questions run over one slide:\n  ${overflowing.join("\n  ")}`
        );
    }
    if (failed.length) {
        console.error(
            `\n${failed.length} questions do not compile:\n  ${failed.join(
                "\n  "
            )}`
        );
        if (keepGoing) {
            console.error("(Going on, without their previews.)");
        } else {
            process.exitCode = 1;
        }
    }
}

await main();
