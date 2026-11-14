"use client";
import React from "react";
import Image from "next/image";
import { Button, Pre, Code } from "nextra/components";
import { allQuestions } from "./all-questions";
import { download } from "./downloader";
import classNames from "classnames";
import { MathRender } from "./math-render";

/** The site's base path (see next.config.mjs). */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type QuestionInfo = (typeof allQuestions)[0];

export function QuestionPreview({
    question,
    unit,
    hideImageTitle = true,
    small = false,
    source,
}: {
    question: number;
    unit: number;
    hideImageTitle?: boolean;
    small?: boolean;
    /** The question's LaTeX, highlighted (see question-preview.tsx). */
    source?: React.ReactNode;
}) {
    const unitStr = String(unit).padStart(2, "0");
    const questionStr = String(question + 1);
    const imageUrl = `${basePath}/slides/unit-${unitStr}-question-${question}.png`;
    const altText = `Question ${questionStr} from Unit ${unitStr}`;
    const q: QuestionInfo = allQuestions.find(
        (q) => q.unit === unit && q.question === question
    ) || { unit, question, title: "", frame: "", images: [] };
    const [showSource, setShowSource] = React.useState(false);

    let w = 400;
    let h = 300;
    let offset = -27;
    if (small) {
        const scale = 0.825;
        w *= scale;
        h *= scale;
        offset *= scale;
    }

    return (
        <div className={classNames("question-preview", { small: small })}>
            <div className="header">
                <h4 className="title">
                    <MathRender content={q.title || altText} />
                </h4>
                {!small && (
                    <div className="actions">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowSource(!showSource);
                            }}
                        >
                            {showSource
                                ? "Show Rendered Question"
                                : "Show TeX Source"}
                        </Button>
                    </div>
                )}
            </div>
            {!showSource ? (
                <Image
                    src={imageUrl}
                    alt={altText}
                    width={w}
                    height={h}
                    className={hideImageTitle ? "hide-image-title" : ""}
                    style={
                        hideImageTitle
                            ? {
                                  objectFit: "cover",
                                  objectPosition: `0px ${offset}px`,
                                  height: h + offset,
                              }
                            : undefined
                    }
                />
            ) : (
                source || (
                    <Pre data-copy="">
                        <Code>{q.frame}</Code>
                    </Pre>
                )
            )}
        </div>
    );
}

export function QuestionDownloader({
    unit,
    sources = [],
}: {
    unit: number;
    /** Each question's highlighted LaTeX, in order (see question-preview.tsx). */
    sources?: React.ReactNode[];
}) {
    const unitStr = String(unit).padStart(2, "0");
    const questions = allQuestions.filter((q) => q.unit === unit);
    const [checked, _setChecked] = React.useState(() =>
        Array.from({ length: questions.length }, () => false)
    );
    function setChecked(i: number, value: boolean) {
        const newChecked = [...checked];
        newChecked[i] = value;
        _setChecked(newChecked);
    }
    const numSelected = checked.filter((c) => c).length;

    return (
        <div className="question-downloader">
            <div className="short-selector">
                <div className="header">
                    <h3>Selected Questions</h3>
                    {numSelected > 0 ? ` (${numSelected} selected)` : ""}
                    <Button
                        disabled={numSelected === 0}
                        onClick={() => {
                            download(
                                questions.filter((q, i) => checked[i]),
                                unitStr,
                                basePath
                            );
                        }}
                    >
                        Download
                    </Button>
                </div>
                <ul>
                    {questions.map((q, i) => {
                        return (
                            <li key={i} className={checked[i] ? "checked" : ""}>
                                <input
                                    type="checkbox"
                                    checked={checked[i]}
                                    onChange={(e) => {
                                        setChecked(i, e.target.checked);
                                    }}
                                    id={`list-question-${i}-checked`}
                                ></input>
                                <label htmlFor={`list-question-${i}-checked`}>
                                    {i + 1}. <MathRender content={q.title} />
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="long-selector">
                <ul>
                    {questions.map((q, i) => {
                        const isChecked = checked[i];
                        return (
                            <li
                                key={i}
                                className={isChecked ? "checked" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setChecked(i, !isChecked);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setChecked(i, !isChecked);
                                    }}
                                    id={`question-${i}-checked`}
                                ></input>
                                <div className="note">
                                    {isChecked
                                        ? "Click to unselect"
                                        : "Click to select"}
                                </div>
                                <label htmlFor={`question-${i}-checked`}>
                                    <QuestionPreview
                                        question={q.question}
                                        unit={unit}
                                        source={sources[i]}
                                    />
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

//export async function getStaticProps() {
//    const path = join(process.cwd(), "public", "all-questions.json");
//    const file = await readFile(path, "utf-8");
//    console.log(file);
//       return JSON.stringify({props: JSON.parse(file)})
//    return { props: "" };
//}
