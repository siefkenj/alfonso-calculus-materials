import React from "react";

function isP(
    child: React.ReactNode
): child is React.ReactElement<{ children?: React.ReactNode }> {
    try {
        return (
            React.isValidElement(child) &&
            (child.type === "p" ||
                (typeof child.type === "function" && child.type.name === "p"))
        );
    } catch (e) {
        return false;
    }
}

/**
 * Display an example with background, a question, and comments.
 */
export function Example({ children }: React.PropsWithChildren<{}>) {
    return (
        <div
            className={`nextra-callout 
                        overflow-x-auto 
                        mt-6 
                        rounded-lg 
                        border 
                        py-2 
                        flex
                        flex-col
                        gap-4
                        space-between
                        contrast-more:border-current 
                        contrast-more:dark:border-current 
                        border-blue-200 
                        bg-blue-100 
                        text-blue-900 
                        dark:border-blue-200/30 
                        dark:bg-blue-900/30 
                        dark:text-blue-200`}
        >
            {children}
        </div>
    );
}

export function Description({ children }: React.PropsWithChildren<{}>) {
    if (!children) {
        return null;
    }
    // We extract the first child. If it's a <p> tag, we take its content.
    const [firstChild, ...rest] = React.Children.map(children, (child, i) => {
        return i === 0 && isP(child) ? child.props.children : child;
    });
    return (
        <div className="w-full min-w-0 leading-7 px-4">
            <p className="mt-6 leading-7 first:mt-0">
                <strong>Example. </strong>
                {firstChild}
            </p>
            {rest}
        </div>
    );
}
export function Background({ children }: React.PropsWithChildren<{}>) {
    if (!children) {
        return null;
    }
    const [firstChild, ...rest] = React.Children.map(children, (child, i) => {
        return i === 0 && isP(child) ? child.props.children : child;
    });
    return (
        <div className="w-full min-w-0 leading-7 px-4">
            <p className="mt-6 leading-7 first:mt-0">
                <strong>Background. </strong>
                {firstChild}
            </p>
            {rest}
        </div>
    );
}

export function Question({ children }: React.PropsWithChildren<{}>) {
    if (!children) {
        return null;
    }
    const [firstChild, ...rest] = React.Children.map(children, (child, i) => {
        return i === 0 && isP(child) ? child.props.children : child;
    });
    return (
        <div
            className={`w-full
                         min-w-0 
                         leading-7 
                         p-4
                         border-2
                         border-solid
                         contrast-more:border-current 
                         contrast-more:dark:border-current 
                         -ml-1
                         border-yellow-100
                         bg-yellow-50
                         text-yellow-900
                         dark:border-yellow-200/30
                         dark:bg-yellow-700/30
                         dark:text-yellow-200`}
        >
            <p className="leading-7">
                <strong>Question. </strong>
                {firstChild}
            </p>
            {rest}
        </div>
    );
}

export function Comments({ children }: React.PropsWithChildren<{}>) {
    if (!children) {
        return null;
    }
    const [firstChild, ...rest] = React.Children.map(children, (child, i) => {
        return i === 0 && isP(child) ? child.props.children : child;
    });
    return (
        <div className="w-full min-w-0 leading-7 px-4">
            <p className="mt-6 leading-7 first:mt-0">
                <strong>Comments. </strong>
                {firstChild}
            </p>
            {rest}
        </div>
    );
}

export default Example;
