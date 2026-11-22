// The divider between the editor's code and its slide, which moves the
// split between them: dragged, with the arrow keys, or back to the middle
// with a double click (or Enter). Side by side, it is upright; on a narrow
// screen, where the slide is below the code, it lies across.
//
// The split is the code's share of the panes, `--split` on them, and is
// remembered in this browser.
import React from "react";

const KEY = "typst-editor-split";
const [MIN, MAX, MIDDLE, STEP] = [0.2, 0.8, 0.5, 0.05];

const clamp = (split: number) => Math.min(MAX, Math.max(MIN, split));

function loadSplit(): number {
    try {
        const split = Number(localStorage.getItem(KEY));
        return split ? clamp(split) : MIDDLE;
    } catch {
        return MIDDLE;
    }
}

function storeSplit(split: number) {
    try {
        if (split === MIDDLE) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, String(split));
    } catch {
        // Not remembered, then.
    }
}

/** Whether the panes are one above the other (globals.css's breakpoint). */
function useStacked() {
    const query = "(max-width: 800px)";
    return React.useSyncExternalStore(
        (changed) => {
            const media = matchMedia(query);
            media.addEventListener("change", changed);
            return () => media.removeEventListener("change", changed);
        },
        () => matchMedia(query).matches,
        () => false
    );
}

/** The split, as `--split` for the panes' style, and the divider. */
export function usePaneSplit(panes: React.RefObject<HTMLElement | null>) {
    const [split, setSplit] = React.useState(MIDDLE);
    React.useEffect(() => setSplit(loadSplit()), []);
    const stacked = useStacked();
    const [dragging, setDragging] = React.useState(false);

    /** Moves the split; and remembers it, unless it is being dragged. */
    const move = (to: number, store = true) => {
        const next = clamp(Math.round(to * 1000) / 1000);
        setSplit(next);
        if (store) storeSplit(next);
    };
    /** The drag ends: where it ended is remembered. */
    const drop = () => {
        if (!dragging) return;
        setDragging(false);
        storeSplit(split);
    };
    /** The split at the pointer. */
    const at = (e: React.PointerEvent) => {
        const box = panes.current?.getBoundingClientRect();
        if (!box) return split;
        return stacked
            ? (e.clientY - box.top) / box.height
            : (e.clientX - box.left) / box.width;
    };

    const divider = (
        <div
            className="pane-splitter"
            role="separator"
            tabIndex={0}
            aria-orientation={stacked ? "horizontal" : "vertical"}
            aria-label="Resize the code and the slide"
            aria-valuemin={MIN * 100}
            aria-valuemax={MAX * 100}
            aria-valuenow={Math.round(split * 100)}
            title="Drag to resize the code and the slide; double-click to share the space equally"
            data-dragging={dragging || undefined}
            onPointerDown={(e) => {
                if (e.button !== 0) return;
                // No text selected while dragging.
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.focus();
                setDragging(true);
            }}
            onPointerMove={(e) => dragging && move(at(e), false)}
            onPointerUp={drop}
            onPointerCancel={drop}
            onDoubleClick={() => move(MIDDLE)}
            onKeyDown={(e) => {
                const step = e.shiftKey ? STEP * 2 : STEP;
                const to = {
                    ArrowLeft: split - step,
                    ArrowUp: split - step,
                    ArrowRight: split + step,
                    ArrowDown: split + step,
                    Home: MIN,
                    End: MAX,
                    Enter: MIDDLE,
                }[e.key];
                if (to === undefined) return;
                e.preventDefault();
                move(to);
            }}
        />
    );
    const style = { "--split": `${split * 100}%` } as React.CSSProperties;
    return { style, divider, dragging };
}
