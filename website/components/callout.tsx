// The callout ("admonition") of Nextra 2, which this site was written for.
// Nextra 4's own `Callout` switched to GitHub-style icons and darker colours;
// this keeps the old emoji, pale borders and dark text. It is a copy of
// nextra@2.13's `components/callout.tsx`, with the `nx-` class prefix dropped.
import React from "react";
import cn from "classnames";

function InformationCircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="20"
            height="20"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            />
        </svg>
    );
}

const TypeToEmoji = {
    default: "💡",
    error: "🚫",
    info: <InformationCircleIcon className="mt-1" />,
    warning: "⚠️",
};

type CalloutType = keyof typeof TypeToEmoji;

const classes: Record<CalloutType, string> = {
    default:
        "border-orange-100 bg-orange-50 text-orange-800 dark:border-orange-400/30 dark:bg-orange-400/20 dark:text-orange-300",
    error: "border-red-200 bg-red-100 text-red-900 dark:border-red-200/30 dark:bg-red-900/30 dark:text-red-200",
    info: "border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-200/30 dark:bg-blue-900/30 dark:text-blue-200",
    warning:
        "border-yellow-100 bg-yellow-50 text-yellow-900 dark:border-yellow-200/30 dark:bg-yellow-700/30 dark:text-yellow-200",
};

export function Callout({
    children,
    type = "default",
    emoji = TypeToEmoji[type],
}: React.PropsWithChildren<{ type?: CalloutType; emoji?: React.ReactNode }>) {
    return (
        <div
            className={cn(
                "nextra-callout overflow-x-auto mt-6 flex rounded-lg border py-2 pe-4",
                "contrast-more:border-current contrast-more:dark:border-current",
                classes[type]
            )}
        >
            <div
                className="select-none text-xl ps-3 pe-2"
                style={{
                    fontFamily:
                        '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                }}
                data-pagefind-ignore="all"
            >
                {emoji}
            </div>
            <div className="w-full min-w-0 leading-7">{children}</div>
        </div>
    );
}
