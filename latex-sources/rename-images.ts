import fs from "node:fs/promises";
import { glob } from "glob";

/**
 * Rename the slides appropriately. This assumes that `convert.ts` has already been run
 * and that `all-questions.json` has been generated. After that, you need to copy the content
 * of `all-questions.tex` into `beamer-template.tex`, compile it, and convert it to a sequence of images
 * using ImageMagick via
 * ```sh
 * convert -density 150 all-questions-comp.pdf q.png
 * ```
 * These files are assumed to be stored in `slides`, and will be labeled `q-??.png`. They should be 0-indexed.
 */
async function main() {
    const imageFiles = glob.sync("./questions/slides/q-*.png");
    const numFiles = imageFiles.length;
    console.log(`Found ${numFiles} image files.`);
    
    const allQuestions = JSON.parse(
        await fs.readFile("./questions/processed/all-questions.json", "utf-8")
    );
    console.log(`Found ${allQuestions.length} questions.`);
    
    for (let i = 0; i < numFiles; i++) {
        const imageFile = imageFiles[i];
        const question = allQuestions[i];
        const newImageFile = `./questions/slides/q-${question.unit}-${question.question}.png`;
        console.log(`Renaming ${imageFile} to ${newImageFile}`);
        await fs.rename(imageFile, newImageFile);
    }
}

await main();
