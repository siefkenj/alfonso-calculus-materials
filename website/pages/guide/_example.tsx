import React from "react";

function isP(child: React.ReactNode): child is React.ReactElement {
    try {
        return (
            React.isValidElement(child) &&
            typeof child.type !== "string" &&
            child.type.name === "p"
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
                        nx-overflow-x-auto 
                        nx-mt-6 
                        nx-rounded-lg 
                        nx-border 
                        nx-py-2 
                        nx-flex
                        nx-flex-col
                        nx-gap-4
                        nx-space-between
                        contrast-more:nx-border-current 
                        contrast-more:dark:nx-border-current 
                        nx-border-blue-200 
                        nx-bg-blue-100 
                        nx-text-blue-900 
                        dark:nx-border-blue-200/30 
                        dark:nx-bg-blue-900/30 
                        dark:nx-text-blue-200`}
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
        <div className="nx-w-full nx-min-w-0 nx-leading-7 nx-px-4">
            <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
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
        <div className="nx-w-full nx-min-w-0 nx-leading-7 nx-px-4">
            <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
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
            className={`nx-w-full
                         nx-min-w-0 
                         nx-leading-7 
                         nx-p-4
                         nx-border-2
                         nx-border-solid
                         contrast-more:nx-border-current 
                         contrast-more:dark:nx-border-current 
                         nx-ml--1
                         nx-border-yellow-100
                         nx-bg-yellow-50
                         nx-text-yellow-900
                         dark:nx-border-yellow-200/30
                         dark:nx-bg-yellow-700/30
                         dark:nx-text-yellow-200`}
        >
            <p className="nx-leading-7">
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
        <div className="nx-w-full nx-min-w-0 nx-leading-7 nx-px-4">
            <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
                <strong>Comments. </strong>
                {firstChild}
            </p>
            {rest}
        </div>
    );
}

export default Example;