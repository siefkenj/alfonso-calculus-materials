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
import { toString as hastToString } from "hast-util-to-string";

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
import {
    unifiedLatexToMdast,
    convertToMarkdown,
} from "@unified-latex/unified-latex-to-mdast";
import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
import { htmlLike } from "@unified-latex/unified-latex-util-html-like";
import { getArgsContent } from "@unified-latex/unified-latex-util-arguments";
import { pgfkeysArgToObject } from "@unified-latex/unified-latex-util-pgfkeys";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

import { expandDs } from "./convert-utils/expand-ds";
import { cleanMboxAndFriends } from "./convert-utils/clean-mbox-and-friends";
import { PageMapper } from "./page-mapper";

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
 * Returns a `remark` replacer that surrounds the node in the specified tag.
 */
function surroundInTagFactory(tag: string) {
    return function (state, node, parent) {
        return [
            {
                type: "html",
                value: `<${tag}>`,
            },
            ...state.all(node),
            {
                type: "html",
                value: `</${tag}>`,
            },
        ];
    };
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
    let unit = 1;

    let allUnitData: {
        unit: number;
        question: number;
        title: string;
        frame: string;
    }[] = [];

    for (unit = 13; unit <= 14; unit++) {
        let unitStr = unit.toString().padStart(2, "0");
        const filename = `./questions/guides/137-ACA-${unitStr}.tex`;
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
                    });
                };
            })
            .use(unifiedLatexStringCompiler);

        processed = String(processor.processSync(processed));

        // The `\includegraphics` commands list the page in the slide deck, not the actual
        // question number. We need to map these page numbers to question numbers.
        const pageMapper = new PageMapper();

        processed = String(
            unified()
                .use(unifiedLatexFromString)
                .use(unifiedLatexToHast, {
                    macroReplacements: {
                        includegraphics: (node) => {
                            const args = getArgsContent(node);
                            const options = pgfkeysArgToObject(args[1]!);
                            const src = printRaw(args[args.length - 1] || []);
                            const page = printRaw(options.page || []);
                            pageMapper.addPage(page);
                            return htmlLike({
                                tag: "img",
                                attributes: {
                                    src,
                                    page,
                                },
                            });
                        },
                    },
                    environmentReplacements: {
                        comments: (node) => {
                            return htmlLike({
                                tag: "comment",
                                content: node.content,
                            });
                        },
                        videos: (node) => {
                            return htmlLike({
                                tag: "videos",
                                content: node.content,
                            });
                        },
                        center: (node) => {
                            return htmlLike({
                                tag: "center",
                                content: node.content,
                            });
                        },
                        warning: (node) => {
                            return htmlLike({
                                tag: "warning",
                                content: node.content,
                            });
                        },
                    },
                })
                .use(rehypeRemark, {
                    handlers: {
                        img: (state, node) => {
                            const page = String(node.properties.page);
                            const questionNum =
                                pageMapper.getQuestionNumber(page);
                            return {
                                type: "html",
                                value: `<QuestionPreview question={${questionNum}} unit={${unit}} small={true} />`,
                            };
                            console.log(node);
                        },
                        br: () => {},
                        span(state, node, parent) {
                            const className = (node.properties.className ||
                                []) as string[];
                            if (className.includes("inline-math")) {
                                // The HTML type prevents the output from being mangled (e.g., `_` turning into `\_`)
                                return {
                                    type: "html",
                                    value: `$${hastToString(node)}$`,
                                };
                            }
                            return state.all(node);
                        },
                        div(state, node, parent) {
                            const className = (node.properties.className ||
                                []) as string[];
                            if (className.includes("display-math")) {
                                return {
                                    type: "code",
                                    lang: "math",
                                    value: hastToString(node),
                                };
                            }
                            return state.all(node);
                        },
                        comment: surroundInTagFactory("Comments"),
                        warning: surroundInTagFactory("Warning"),
                        videos: surroundInTagFactory("Videos"),
                        center: surroundInTagFactory("Slides"),
                    },
                })
                //   .use(unifiedLatexToMdast, {
                //       nodeHandlers: {
                //           img: (state, node) => {
                //               console.log(node);
                //           },
                //           div: (state, node) => {
                //               console.log(node);
                //           },
                //       },
                //   })
                // @ts-ignore
                .use(remarkStringify)
                .processSync(processed)
        );
        // Process once more for the final pretty print
        // processed = prettyPrint(processed);

        //console.log(processed)
        // Write the .tex file.
        await fs.writeFile(
            `./questions/guides/processed/137-ACA-${unitStr}.mdx`,
            processed
        );
    }
    //    await fs.writeFile(
    //        `./questions/processed/all-questions.json`,
    //        JSON.stringify(allUnitData, null, 2)
    //    );
    //    await fs.writeFile(
    //        "./questions/all-questions.tex",
    //        allUnitData.map((x) => x.frame).join("\n\n")
    //    );
}

await main();
