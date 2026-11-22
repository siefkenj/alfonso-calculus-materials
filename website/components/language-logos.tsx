// The logos of the source languages, for the buttons that choose between them
// (narrower than the names). Each is an image named for screen readers, or,
// beside the name, `decorative` and hidden from them.
import type React from "react";
import { SOURCE_LANGUAGES, type SourceLanguage } from "./source-language";

type LogoProps = { decorative?: boolean };
const labelled = (name: string, decorative?: boolean) =>
    decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name };

/** Typst's "t", from Simple Icons (https://simpleicons.org, CC0). */
export function TypstLogo({ decorative }: LogoProps) {
    return (
        <svg
            className="language-logo typst-logo"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...labelled("Typst", decorative)}
        >
            <path d="M12.654 17.846c0 1.114.16 1.861.479 2.242.32.381.901.572 1.743.572.872 0 1.99-.44 3.356-1.319l.871 1.45C16.547 22.931 14.44 24 12.785 24c-1.656 0-2.964-.395-3.922-1.187-.959-.82-1.438-2.256-1.438-4.307V6.989H5.246l-.349-1.626 2.528-.791V2.418L12.654 0v4.835l5.142-.395-.48 2.857-4.662-.176v10.725Z" />
        </svg>
    );
}

/** Knuth's TeX logo, set as he sets it: the E lowered between T and X. */
export function TeXLogo({ decorative }: LogoProps) {
    return (
        <span
            className="language-logo tex-logo"
            {...labelled("LaTeX", decorative)}
        >
            T<span className="tex-logo-e">E</span>X
        </span>
    );
}

export function LanguageLogo({
    language,
    decorative,
}: { language: SourceLanguage } & LogoProps) {
    return language === "typst" ? (
        <TypstLogo decorative={decorative} />
    ) : (
        <TeXLogo decorative={decorative} />
    );
}

/**
 * What `render` gives for each language, one on top of another, all but
 * `language`'s hidden: as wide as the widest, so that the layout does not
 * shift when the language changes.
 */
export function ForEitherLanguage({
    language,
    render,
}: {
    language: SourceLanguage;
    render: (language: SourceLanguage) => React.ReactNode;
}) {
    return (
        <span className="either-language">
            {SOURCE_LANGUAGES.map((l) => (
                <span
                    key={l.id}
                    className="either-language-item"
                    data-shown={l.id === language}
                    aria-hidden={l.id === language ? undefined : true}
                >
                    {render(l.id)}
                </span>
            ))}
        </span>
    );
}

/** "LaTeX" or "Typst". */
export const languageName = (language: SourceLanguage) =>
    SOURCE_LANGUAGES.find((l) => l.id === language)?.name ?? language;

/** The source languages, as a menu's options: each with its logo. */
export const LANGUAGE_OPTIONS = SOURCE_LANGUAGES.map((l) => ({
    id: l.id,
    name: (
        <span className="language-option">
            <LanguageLogo language={l.id} decorative />
            {l.name}
        </span>
    ),
}));

/** The down arrow that marks a menu. */
export function MenuArrow() {
    return (
        <svg
            className="menu-arrow"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
        >
            <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
