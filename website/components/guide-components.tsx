import React from "react";
import { Callout } from "./callout";

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
function isUl(
    child: React.ReactNode
): child is React.ReactElement<{ children?: React.ReactNode }> {
    try {
        return (
            React.isValidElement(child) &&
            (child.type === "ul" ||
                (typeof child.type === "function" && child.type.name === "ul"))
        );
    } catch (e) {
        return false;
    }
}

export function Slides({ children }: React.PropsWithChildren<{}>) {
    return <div className="slides">{children}</div>;
}

export function Videos({ children }: React.PropsWithChildren<{}>) {
    if (!children) {
        return null;
    }
    // We extract the first child. If it's a <p> tag, we take its content.
    children = React.Children.map(children, (child, i) => {
        return i === 0 && isP(child) ? child.props.children : child;
    });
    return (
        <Callout type="error" emoji="">
            <div className="videos">
                <h3 className="title">Related Videos</h3>
                <div className="content">{children}</div>
            </div>
        </Callout>
    );
}

export function Comments({ children }: React.PropsWithChildren<{}>) {
    return (
        <div className="comments">
            <Callout type="info" emoji="">
                <strong>Comments</strong>
                {children}
            </Callout>
        </div>
    );
}

export function Warning({ children }: React.PropsWithChildren<{}>) {
    // We extract the first child. If it's a <p> tag, we take its content.
    let _children = [...React.Children.map(children, (child, i) => child)];
    if (_children.length === 0) {
        return null;
    }
    const firstChild = _children[0];
    const firstChildIsP = isP(firstChild);
    let init: React.ReactNode = firstChild;
    if (firstChildIsP) {
        init = firstChild.props.children;
    }

    return (
        <Callout type="warning">
            {firstChildIsP ? (
                <p className="mt-6 leading-7 first:mt-0">
                    <strong>Warning. </strong>
                    {init}
                </p>
            ) : (
                <React.Fragment>
                    <strong>Warning</strong>
                    {init}
                </React.Fragment>
            )}
            {_children.slice(1)}
        </Callout>
    );
}
