/**
 * Renders the LaTeX previews of the questions, as the site shows them
 * (website/public/slides/unit-NN-question-N.png), from the units' Beamer
 * files (questions/137-CA-NN.tex): each unit compiled in handout mode, one
 * page a question (all of its `\pause`d parts shown), at 150 dpi.
 *
 *   npx vite-node latex-sources/render-previews.ts [--shapes 16:9,4:3] [--units 1,2]
 *
 * By default it renders the 16:9 previews (`unit-NN-question-N.16x9.png`):
 * 170.67 mm × 96 mm, as tall as the 4:3 ones and only wider, which is what
 * the site's 16:9 downloads are. The 4:3 previews were made otherwise (from
 * all-questions-comp.pdf, with ImageMagick; see rename-images.ts) and are
 * kept; `--shapes 4:3` makes them again this way.
 *
 * It needs pdflatex (TeX Live, with adjustbox, bbding, multirow and
 * tkz-berge) and pdftoppm (Poppler).
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { LATEX_WIDESCREEN } from "../website/components/full-source";
import {
    SLIDE_SHAPES,
    previewName,
    type SlideShape,
} from "../website/components/site";

const ROOT = path.resolve(import.meta.dirname, "..");
const QUESTIONS = path.join(ROOT, "latex-sources/questions");
const SLIDES = path.join(ROOT, "website/public/slides");
const UNITS = 14;

/** The values of `--<name> a,b`, each one of `valid`; null without it. */
function option<T extends string>(
    name: string,
    valid: readonly T[]
): T[] | null {
    const i = process.argv.indexOf(`--${name}`);
    if (i < 0) return null;
    const values = process.argv[i + 1]?.split(",") ?? [];
    const wrong = values.filter((v) => !valid.includes(v as T));
    if (!values.length || wrong.length) {
        console.error(
            `--${name} takes one or more of ${valid.join(", ")}, with commas` +
                (wrong.length ? `; not ${wrong.join(", ")}` : "")
        );
        process.exit(1);
    }
    return values as T[];
}

const shapes = option("shapes", SLIDE_SHAPES) ?? ["16:9"];
const units = (
    option(
        "units",
        Array.from({ length: UNITS }, (_, i) => String(i + 1))
    ) ?? []
).map(Number);

/** A unit's Beamer file, in handout mode, of `shape`. */
function unitDocument(source: string, shape: SlideShape): string {
    const handout = source.replace(
        "\\documentclass[14pt]{beamer}",
        "\\documentclass[14pt,handout]{beamer}"
    );
    if (handout === source) throw new Error("No \\documentclass[14pt]{beamer}");
    if (shape === "4:3") return handout;
    return handout.replace(
        "\\begin{document}",
        `${LATEX_WIDESCREEN}\n\\begin{document}`
    );
}

async function main() {
    const questions: { unit: number }[] = JSON.parse(
        await fs.readFile(
            path.join(ROOT, "website/public/all-questions.json"),
            "utf8"
        )
    );
    const work = await fs.mkdtemp(path.join(os.tmpdir(), "previews-"));
    let written = 0;
    for (let unit = 1; unit <= UNITS; unit++) {
        if (units.length && !units.includes(unit)) continue;
        const nn = String(unit).padStart(2, "0");
        const source = await fs.readFile(
            path.join(QUESTIONS, `137-CA-${nn}.tex`),
            "utf8"
        );
        const count = questions.filter((q) => q.unit === unit).length;
        for (const shape of shapes) {
            const name = `unit-${nn}-${shape === "16:9" ? "16x9" : "4x3"}`;
            await fs.writeFile(
                path.join(work, `${name}.tex`),
                unitDocument(source, shape)
            );
            try {
                execFileSync(
                    "pdflatex",
                    ["-interaction=nonstopmode", "-halt-on-error", name],
                    {
                        cwd: work,
                        // The images are beside the units' files.
                        env: { ...process.env, TEXINPUTS: `${QUESTIONS}//:` },
                        stdio: "ignore",
                    }
                );
            } catch {
                throw new Error(
                    `Unit ${unit} (${shape}) does not compile: see ${path.join(
                        work,
                        `${name}.log`
                    )}`
                );
            }
            const pdf = path.join(work, `${name}.pdf`);
            const pages = Number(
                /Pages:\s+(\d+)/.exec(
                    execFileSync("pdfinfo", [pdf], { encoding: "utf8" })
                )?.[1]
            );
            // One page a question, in order: else they would be mislabelled.
            if (pages !== count) {
                throw new Error(
                    `Unit ${unit} (${shape}) has ${pages} pages for ${count} questions`
                );
            }
            execFileSync("pdftoppm", [
                "-png",
                "-r",
                "150",
                pdf,
                path.join(work, name),
            ]);
            for (let q = 0; q < count; q++) {
                // pdftoppm numbers the pages from 1, padded to the last's width.
                const page = String(q + 1).padStart(String(count).length, "0");
                await fs.copyFile(
                    path.join(work, `${name}-${page}.png`),
                    path.join(SLIDES, `${previewName(unit, q, shape)}.png`)
                );
                written++;
            }
        }
    }
    await fs.rm(work, { recursive: true });
    console.log(`Wrote ${written} previews to ${path.relative(ROOT, SLIDES)}.`);
}

main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
});
