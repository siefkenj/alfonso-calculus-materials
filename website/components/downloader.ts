import type { allQuestions } from "./all-questions";
import JSZip from "jszip";
import FileSave from "file-saver";

type QuestionInfo = (typeof allQuestions)[0];

export async function download(questions: QuestionInfo[], unit: string) {
    // First we figure out if any images are needed.
    const images = new Set<string>();
    for (const question of questions) {
        for (const image of question.images) {
            images.add(image);
        }
    }
    // Next we download the template.
    const template = await fetch("/beamer-template.tex").then((res) =>
        res.text()
    );

    const indentedQuestions = questions
        .map((q) => "\t" + q.frame.replace(/\n/g, "\n\t"))
        .join("\n\n");
    const filledTemplate = template.replace(
        "%%SLIDES_HERE%%",
        indentedQuestions
    );

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
        const imagePromises = Array.from(images).map((image) =>
            fetch(`/slide-images/${image}`).then((res) => res.blob())
        );
        const imageBlobs = await Promise.all(imagePromises);
        for (let i = 0; i < imagesList.length; i++) {
            zip.file(imagesList[i], imageBlobs[i]);
        }
        const content = await zip.generateAsync({ type: "blob" });
        FileSave.saveAs(content, `${baseName}.zip`);
    }
}
