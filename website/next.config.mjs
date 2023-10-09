import nextraConfig from "nextra";
import fs from "node:fs";
import path from "node:path";
import util from "util";
// Register math nodes in mdast:
/// <reference types="mdast-util-math" />

import { visit } from "unist-util-visit";

/**
 * Explicitly convert math code blocks to display-math nodes.
 */
function mathCodeBlocksToMath() {
    /**
     * @param {import('mdast').Root} tree
     *   Tree.
     * @returns {undefined}
     *   Nothing.
     */
    return function (tree) {
        visit(tree, (node) => {
            if (node && node.type === "code" && node.lang === "math") {
                node.type = "displayMath";
                delete node.meta;
                delete node.lang;
                node.data = {
                    hName: "code",
                    hProperties: {
                        className: ["language-math", "math-display"],
                    },
                    hChildren: [{ type: "text", value: node.value }],
                };
            }
        });
    };
}

/**
 * Explicitly convert math code blocks to display-math nodes.
 */
function insertLatexCodeBlocksIntoQuestionPreview() {
    const questionsPath = path.join(
        process.cwd(),
        "public",
        "all-questions.json"
    );
    let allQuestions = [];
    try {
        allQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
    } catch (e) {
        console.warn(
            "Failed to load all-questions.json. Searched",
            questionsPath
        );
    }

    /**
     * @param {import('mdast').Root} tree
     *   Tree.
     * @returns {undefined}
     *   Nothing.
     */
    return async function (tree) {
        visit(tree, (node) => {
            // QuestionPreview gets a code block inserted directly as its child.
            if (
                node &&
                node.type === "mdxJsxFlowElement" &&
                node.name === "QuestionPreview"
            ) {
                // Get the question and unit number
                let questionNum = node.attributes.find(
                    (x) => x.name === "question"
                )?.value?.value;
                let unitNum = node.attributes.find((x) => x.name === "unit")
                    ?.value?.value;
                if (questionNum == null || unitNum == null) {
                    // Couldn't find the question number/unit. Nothing to do.
                    return;
                }
                questionNum = parseInt(questionNum, 10);
                unitNum = parseInt(unitNum, 10);
                let question = allQuestions.find(
                    (x) => x.question === questionNum && x.unit === unitNum
                );
                if (!question) {
                    console.warn(
                        "Couldn't find question",
                        questionNum,
                        unitNum,
                        "in all-questions.json"
                    );
                    return;
                }
                // Make an MDX code block for LaTeX.
                const latexCodeBlock = {
                    type: "code",
                    lang: "latex",
                    meta: null,
                    value: question.frame,
                };
                node.children.push(latexCodeBlock);
            }

            // QuestionDownloader gets all code blocks inserted directly as its children.
            if (
                node &&
                node.type === "mdxJsxFlowElement" &&
                node.name === "QuestionDownloader"
            ) {
                // Get the question and unit number
                let unitNum = node.attributes.find((x) => x.name === "unit")
                    ?.value?.value;
                if (unitNum == null) {
                    // Couldn't find the question number/unit. Nothing to do.
                    return;
                }
                unitNum = parseInt(unitNum, 10);
                let questions = allQuestions.filter((x) => x.unit === unitNum);
                if (!questions.length) {
                    console.warn(
                        "Couldn't find question for unit",
                        unitNum,
                        "in all-questions.json"
                    );
                    return;
                }
                // Make an MDX code block for LaTeX.
                node.children.push(
                    ...questions.map((q) => ({
                        type: "code",
                        lang: "latex",
                        meta: null,
                        value: q.frame,
                    }))
                );
            }
        });
    };
}

//const origLog = console.log;
//console.log = (...args) => {
//    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
//};

const withNextra = nextraConfig({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    latex: true,
    mdxOptions: {
        remarkPlugins: [
            mathCodeBlocksToMath,
            insertLatexCodeBlocksIntoQuestionPreview,
            //function () {
            //    const origParser = this.Parser || this.parser;
            //    if (!origParser) {
            //        return;
            //    }
            //    this.Parser = this.parser = function (source) {
            //        console.log(source);
            //        return origParser.call(this, source);
            //    };
            //},
        ],
    },
    //    transform: (result, { route }) => {
    //        console.log(result, route);
    //        return result;
    //    },
    staticImage: true,
});

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
    // trim off `<owner>/`
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
}

const config = withNextra({
    images: {
        unoptimized: true,
    },
    webpack: (config, options) => {
        config.resolve.fallback = { fs: false, path: false };
    },
    assetPrefix,
    basePath,
    //productionBrowserSourceMaps: true,
});

export default config;
