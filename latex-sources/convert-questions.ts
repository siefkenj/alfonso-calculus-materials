import fs from "node:fs/promises";
import { glob } from "glob";
import { processLatexToAstViaUnified } from "@unified-latex/unified-latex";
import { replaceNode } from "@unified-latex/unified-latex-util-replace";
import { visit, EXIT } from "@unified-latex/unified-latex-util-visit";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import {
    unifiedLatexFromString,
    unifiedLatexFromStringMinimal,
} from "@unified-latex/unified-latex-util-parse";
import {
    unifiedLatexStringCompiler,
    toString,
} from "@unified-latex/unified-latex-util-to-string";
import { unified } from "unified";

import * as Ast from "@unified-latex/unified-latex-types";
import {
    expandMacros,
    expandMacrosExcludingDefinitions,
    listNewcommands,
} from "@unified-latex/unified-latex-util-macros";
import { Plugin } from "unified";
import {
    attachMacroArgs,
    unifiedLatexAttachMacroArguments,
} from "@unified-latex/unified-latex-util-arguments";
import { lints } from "@unified-latex/unified-latex-lint";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { expandDs } from "./convert-utils/expand-ds";
import { cleanMboxAndFriends } from "./convert-utils/clean-mbox-and-friends";

const availableLints = Object.fromEntries(
    Object.values(lints).map((lint) => [
        lint.name.replace(/^unified-latex-lint:/, ""),
        lint,
    ])
);

type PluginOptions2 = {
    macros: { name: string; signature: string; body: Ast.Node[] }[];
};

function prettyPrint(source: string): string {
    return String(
        unified()
            .use(unifiedLatexFromString)
            .use(unifiedLatexStringCompiler, { pretty: true })
            .processSync(source)
    );
}

/**
 * Plugin that expands the specified macros.
 */
export const expandMacrosPlugin: Plugin<PluginOptions2[], Ast.Root, Ast.Root> =
    function (options) {
        const { macros = [] } = options || {};
        const macroInfo = Object.fromEntries(
            macros.map((m) => [m.name, { signature: m.signature }])
        );
        return (tree) => {
            // We need to attach the arguments to each macro before we process it!
            attachMacroArgs(tree, macroInfo);
            expandMacros(tree, macros);
        };
    };

type PluginOptions = {
    macros?: string[];
};

/**
 * Plugin that expands the specified macros by name. These macros must be defined in the document via
 * `\newcommand...` or equivalent.
 */
export const expandDocumentMacrosPlugin: Plugin<
    PluginOptions[],
    Ast.Root,
    Ast.Root
> = function (options) {
    const { macros = [] } = options || {};
    const macrosSet = new Set(macros);

    return (tree) => {
        const newcommands = listNewcommands(tree);
        const macros = newcommands;

        const macroInfo = Object.fromEntries(
            macros.map((m) => [m.name, { signature: m.signature }])
        );
        // We need to attach the arguments to each macro before we process it!
        attachMacroArgs(tree, macroInfo);
        expandMacrosExcludingDefinitions(tree, macros);
    };
};

async function main() {
    let newcommands: ReturnType<typeof listNewcommands> = [];
    let unit = 14;

    const slideImages = glob
        .sync("./questions/slide-images/*")
        .map((i) => i.replace(/.*\//, ""));

    let allUnitData: {
        unit: number;
        question: number;
        title: string;
        frame: string;
    }[] = [];

    for (unit = 1; unit <= 14; unit++) {
        let unitStr = unit.toString().padStart(2, "0");
        const filename = `./questions/137-CA-${unitStr}.tex`;
        let source = await fs.readFile(filename, "utf-8");
        let processed: string = source;
        console.log("Processing", filename);

        // First we manually replace the `\DS` macro with its definition.
        // We do this because content in the `\DS` macros should be processed in math mode,
        // but unified-latex has no way to tell this.
        processed = expandDs(processed);

        const processor = unified()
            .use(unifiedLatexFromString, {
                macros: {
                    DS: { signature: "m", renderInfo: { inMathMode: true } },
                },
            })
            .use(expandMacrosPlugin, {
                macros: [
                    {
                        name: "\n",
                        signature: "",
                        body: [{ type: "string", content: "\n" }],
                    },
                ],
            })
            .use(expandDocumentMacrosPlugin)
            .use(cleanMboxAndFriends)
            .use(lints.unifiedLatexLintNoTexFontShapingCommands, { fix: true })
            //       .use(lints.unifiedLatexLintArgumentColorCommands, { fix: true })
            // Some macros are "two layers deep". We could recursively expand them,
            // but the cheap solution is to manually expand again.
            .use(function () {
                return expandDocumentMacrosPlugin.call(this);
            })
            .use(function () {
                return (tree) => {
                    let index = 0;
                    replaceNode(tree, (node) => {
                        if (node.type !== "environment") {
                            return;
                        }
                        const envName = printRaw(node.env);
                        if (envName !== "frame") {
                            return;
                        }
                        index++;
                        // We found a frame, now grab the title.
                        let title: string = "";
                        let includedGraphics: string[] = [];
                        visit(node, (innerNode) => {
                            if (innerNode.type !== "macro") {
                                return;
                            }
                            if (innerNode.content === "frametitle") {
                                const titleNodes = structuredClone(
                                    innerNode.args![2].content
                                );
                                expandUnicodeLigatures(titleNodes);
                                // En-dashes are used where em-dashes should be.
                                // Just replace them.
                                title = printRaw(titleNodes).replace("–", "—");
                            }
                            if (innerNode.content === "includegraphics") {
                                const imageFile = printRaw(
                                    innerNode.args![3].content
                                );
                                includedGraphics.push(imageFile);
                            }
                        });

                        const nodeInfo = {
                            unit,
                            question: index - 1,
                            title: title,
                            images: slideImages.filter((i) =>
                                includedGraphics.some((j) => {
                                    if (j.includes(".")) {
                                        return i.startsWith(j);
                                    }
                                    return i.startsWith(j + ".");
                                })
                            ),
                        };

                        allUnitData.push({
                            ...nodeInfo,
                            frame: prettyPrint(printRaw(node)),
                        });

                        return [
                            {
                                type: "comment",
                                content:
                                    "QUESTION_INFO: " +
                                    JSON.stringify(nodeInfo),
                            },
                            node,
                        ];
                    });
                };
            })
            .use(unifiedLatexStringCompiler);

        processed = String(processor.processSync(processed));
        // Process once more for the final pretty print
        processed = prettyPrint(processed);

        //console.log(processed)
        // Write the .tex file.
        await fs.writeFile(
            `./questions/processed/137-CA-${unitStr}.tex`,
            processed
        );
    }
    await fs.writeFile(
        `./questions/processed/all-questions.json`,
        JSON.stringify(allUnitData, null, 2)
    );
    await fs.writeFile(
        "./questions/all-questions.tex",
        allUnitData.map((x) => x.frame).join("\n\n")
    );
}

await main();
