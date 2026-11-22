"use client";
import React from "react";
import autoRender from "katex/contrib/auto-render";
// Nextra adds KaTeX's stylesheet only to pages with maths in their MDX: the
// titles rendered here need it too, or KaTeX's MathML shows beside the maths.
import "katex/dist/katex.min.css";

/**
 * Render content that may have inline math in it. Rendering is done via KaTeX.
 */
export function MathRender({ content }: { content: string }) {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
        if (ref.current && content.includes("$")) {
            autoRender(ref.current, {
                delimiters: [{ left: "$", right: "$", display: false }],
            });
        }
    }, [ref.current, content]);
    return <span ref={ref}>{content}</span>;
}
