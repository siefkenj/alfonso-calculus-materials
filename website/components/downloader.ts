import type { allQuestions } from "./all-questions";
import JSZip from "jszip";
import FileSave from "file-saver";
import { latexDocument } from "./full-source";
import { basePath, type SlideShape } from "./site";
import { compilePdf } from "./typst-compiler";

type QuestionInfo = (typeof allQuestions)[0];

export async function download(
    questions: QuestionInfo[],
    unit: string,
    shape: SlideShape = "4:3"
) {
    // First we figure out if any images are needed.
    const images = new Set<string>();
    for (const question of questions) {
        for (const image of question.images) {
            images.add(image);
        }
    }
    const filledTemplate = await latexDocument(questions, shape);

    const baseName = `unit-${unit}-slides`;
    const fileName = `${baseName}.tex`;
    if (images.size === 0) {
        // If there are no images needed, we package the template as a tex file and
        // download it.
        const blob = new Blob([filledTemplate], { type: "text/plain" });
        FileSave.saveAs(blob, fileName);
    } else {
        // Fetch all the images as blobs and then package them up with jszip.
        const zip = new JSZip();
        zip.file(fileName, filledTemplate);
        const imagesList = Array.from(images);
        const imagePromises = Array.from(images).map(async (image) => {
            const res = await fetch(`${basePath}/slide-images/${image}`);
            if (!res.ok) {
                throw new Error(`Could not load ${image} (${res.status})`);
            }
            return res.blob();
        });
        const imageBlobs = await Promise.all(imagePromises);
        for (let i = 0; i < imagesList.length; i++) {
            zip.file(imagesList[i], imageBlobs[i]);
        }
        const content = await zip.generateAsync({ type: "blob" });
        FileSave.saveAs(content, `${baseName}.zip`);
    }
}

/**
 * Download a Typst document of questions (one file, with the template and
 * what draws the graphs inline; unlike the LaTeX, no zip) as `<baseName>.typ`,
 * or its slides as a PDF, `<baseName>.pdf`, compiled in the browser, each
 * `#pause` a slide of its own.
 */
export async function downloadTypst(
    document: string,
    baseName: string,
    as: "typ" | "pdf"
) {
    if (as === "typ") {
        const blob = new Blob([document], { type: "text/plain" });
        FileSave.saveAs(blob, `${baseName}.typ`);
    } else {
        const pdf = await compilePdf(document);
        const blob = new Blob([pdf as BlobPart], { type: "application/pdf" });
        FileSave.saveAs(blob, `${baseName}.pdf`);
    }
}
