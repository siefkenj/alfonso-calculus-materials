import React from "react";
import autoRender from "katex/contrib/auto-render";

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
