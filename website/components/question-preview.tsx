import React from "react";
import Image from "next/image";
import { Button, Pre, Code } from "nextra/components";
import { CopyIcon, ExpandIcon } from "nextra/icons";
import { allQuestions } from "./all-questions";
import { download } from "./downloader";
import classNames from "classnames";
import { useRouter } from "next/router";

type QuestionInfo = (typeof allQuestions)[0];

export function QuestionPreview({
    question,
    unit,
    hideImageTitle = true,
    small = false,
    children,
}: React.PropsWithChildren<{
    question: number;
    unit: number;
    hideImageTitle?: boolean;
    small?: boolean;
}>) {
    const { basePath } = useRouter();
    const unitStr = String(unit).padStart(2, "0");
    const questionStr = String(question + 1);
    const imageUrl = `${basePath}/slides/unit-${unitStr}-question-${question}.png`;
    const altText = `Question ${questionStr} from Unit ${unitStr}`;
    const q: QuestionInfo = allQuestions.find(
        (q) => q.unit === unit && q.question === question
    ) || { unit, question, title: "", frame: "", images: [] };
    const [showSource, setShowSource] = React.useState(false);

    // Special pre-processing for ensures the first child is the highlighted source
    // code of the problem.
    const childrenArray = React.Children.toArray(children);

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
                <h4 className="title">{q.title || altText}</h4>
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
                childrenArray[0] || (
                    <Pre hasCopyCode>
                        <Code>{q.frame}</Code>
                    </Pre>
                )
            )}
        </div>
    );
}

export function QuestionDownloader({
    unit,
    children,
}: React.PropsWithChildren<{ unit: number }>) {
    const { basePath } = useRouter();
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
    const childrenArray = React.Children.toArray(children);

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
                                    {i + 1}. {q.title}
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
                                    >
                                        {childrenArray[i]}
                                    </QuestionPreview>
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
