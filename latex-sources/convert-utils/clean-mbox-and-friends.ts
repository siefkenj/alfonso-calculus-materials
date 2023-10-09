import { replaceNode } from "@unified-latex/unified-latex-util-replace";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { unified, Transformer } from "unified";

import * as Ast from "@unified-latex/unified-latex-types";

export const cleanMboxAndFriends: () => Transformer<Ast.Root> = function () {
    return (tree) => {
        // Any use of `\mbox{}` inside of math mode should actually be `\text{}`.
        visit(tree, (node, info) => {
            if (!info.context.inMathMode) {
                return;
            }
            if (node.type !== "macro" || node.content !== "mbox") {
                return;
            }
            node.content = "text";
        });
        replaceNode(tree, (node, info) => {
            if (
                node.type === "string" &&
                info.context.inMathMode &&
                node.content === "<"
            ) {
                // We need to check for instances of `<<` and replace them with `\ll`.
                const container = info.containingArray!;
                const index = info.index!;
                const next = container[index + 1];
                const prev = container[index - 1];
                if (next && next.type === "string" && next.content === "<") {
                    const ret: Ast.Macro = {
                        type: "macro",
                        content: "ll",
                    };
                    return ret;
                }
                if (prev && prev.type === "macro" && prev.content === "ll") {
                    return null;
                }
            }
            if (node.type !== "macro") {
                return;
            }
            switch (node.content) {
                // We want to comment out all `\pause` macros
                case "pause": {
                    const ret: Ast.Comment[] = [
                        //{
                        //    type: "comment",
                        //    content: ` I normally pause the lesson here. Uncomment below to insert a pause in the slides.`,
                        //},
                        {
                            type: "comment",
                            content: ` \\pause`,
                        },
                    ];
                    return ret;
                }
                case "frac": {
                    // Because of some crazy context switching, unified-latex is not able to figure
                    // out if it is in math mode or not. If we find a frac with only one arg, we adjust it.
                    if (node.args && node.args[1].content.length === 0) {
                        const arg0 = node.args[0];
                        const argContent = arg0.content.pop()!;
                        if (
                            argContent.type === "string" &&
                            argContent.content.length > 1
                        ) {
                            arg0.content.push({
                                type: "string",
                                content: argContent.content[0],
                            });
                            argContent.content = argContent.content.slice(1);
                        }
                        const arg1 = node.args[1];
                        arg1.content.push(argContent);
                    }
                }
            }
        });
    };
};
