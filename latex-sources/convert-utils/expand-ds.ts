import { replaceNode } from "@unified-latex/unified-latex-util-replace";
import { unifiedLatexFromStringMinimal } from "@unified-latex/unified-latex-util-parse";
import { unifiedLatexStringCompiler } from "@unified-latex/unified-latex-util-to-string";
import { unified } from "unified";

import * as Ast from "@unified-latex/unified-latex-types";
import { unifiedLatexAttachMacroArguments } from "@unified-latex/unified-latex-util-arguments";

/**
 * Expand the `\DS{}` macro without parsing any other macros.
 * The source will need to be re-parsed after this.
 */
export function expandDs(source: string): string {
    // We are being really dumb and expand the `\DS` macro even inside of a `\newcommand` macro.
    // The easiest solution is to just remove the `\newcommand` macro entirely.
    source = source.replace(/^.newcommand\s?{.?DS}.*$/gm, "");

    let processed: string;

    // First we manually replace the `\DS` macro with its definition.
    // We do this because content in the `\DS` macros should be processed in math mode,
    // but unified-latex has no way to tell this.
    processed = String(
        unified()
            .use(unifiedLatexFromStringMinimal)
            .use(unifiedLatexAttachMacroArguments, {
                macros: {
                    DS: { signature: "m", renderInfo: { inMathMode: true } },
                },
            })
            .use(function () {
                return (tree) => {
                    replaceNode(tree, (node) => {
                        if (node.type !== "macro" || node.content !== "DS") {
                            return;
                        }
                        const ret: Ast.InlineMath = {
                            type: "inlinemath",
                            content: [
                                // This is fine as a string. It will be reprocessed very soon.
                                { type: "string", content: "\\displaystyle " },
                                ...(node?.args?.[0]?.content || []),
                            ],
                        };
                        return ret;
                    });
                };
            })
            .use(unifiedLatexStringCompiler)
            .processSync(source)
    );

    return processed;
}
