// The pill that says a question has edits, with the button that reverts them,
// "Edited | ↺", and after a revert, "Reverted to the site's version. Undo":
// the same below a slide, in the list of questions to download, and in the
// editor.
import { Button } from "nextra/components";
import {
    revertEdit,
    undoRevert,
    useEditError,
    useRevertedEdit,
    useSavedEdit,
} from "./saved-edits";

/** A backwards round arrow (Lucide's "rotate-ccw"). */
function RevertIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );
}

export function EditedPill({
    label = "Edited",
    title,
    error = false,
    onRevert,
}: {
    /** "Edited", or what is wrong with the edits. */
    label?: string;
    /** What the edits are, on hover. */
    title: string;
    /** Shown in red: the edits do not compile, or are not saved. */
    error?: boolean;
    onRevert: () => void;
}) {
    return (
        <span
            className="edited-badge edited-pill"
            data-state={error ? "error" : undefined}
        >
            <span title={title}>{label}</span>
            <button
                type="button"
                className="edited-revert"
                onClick={onRevert}
                aria-label="Revert to the original version of the question"
                title="Revert to the original version of the question"
            >
                <RevertIcon />
            </button>
        </span>
    );
}

/** After a revert: what happened, and the button that undoes it. */
export function RevertedNote({ onUndo }: { onUndo: () => void }) {
    return (
        <span className="reverted-note">
            <span>Reverted to the site&rsquo;s version.</span>
            <Button
                className="outlined-button small-button"
                onClick={onUndo}
                title="Bring back the edits you reverted"
            >
                Undo
            </Button>
        </span>
    );
}

/**
 * The question's edits saved in this browser, `name`: the pill, red if they
 * do not compile; or after a revert, the note with Undo; or nothing.
 */
export function QuestionEdits({ name }: { name: string }) {
    const edit = useSavedEdit(name);
    const reverted = useRevertedEdit(name);
    const error = useEditError(name);
    if (edit) {
        return (
            <EditedPill
                label={error ? "Edited, does not compile" : "Edited"}
                error={!!error}
                title={
                    error
                        ? `Your edits to this question do not compile, so the slide is the site's:\n${error}`
                        : "Your edits are saved in this browser: the slide and its Typst download are as edited"
                }
                onRevert={() => revertEdit(name, edit)}
            />
        );
    }
    if (reverted) return <RevertedNote onUndo={() => undoRevert(name)} />;
    return null;
}
