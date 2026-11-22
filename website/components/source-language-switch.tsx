"use client";
// The site-wide LaTeX/Typst switch, beside the light/dark switch at the foot
// of the sidebar (and of the mobile menu). Nextra has no slot there, so it is
// put into the sidebar's footer with a portal; should Nextra rename that
// footer, the switch just does not show, and the questions' own menus still
// set the language.
import React from "react";
import { createPortal } from "react-dom";
import { LanguageMenu } from "./language-menu";
import { useSourceLanguage } from "./source-language";
import {
    ForEitherLanguage,
    LanguageLogo,
    MenuArrow,
    languageName,
} from "./language-logos";

function LanguageSelect() {
    const language = useSourceLanguage();
    const name = languageName(language);
    return (
        <div className="source-language-switch">
            <LanguageMenu
                title={`Source language: ${name}. Choose LaTeX or Typst for the sources, previews and downloads of the whole site`}
                anchor="top start"
                selectedOption={
                    <span className="flex items-center gap-2">
                        <ForEitherLanguage
                            language={language}
                            render={(l) => (
                                <span className="flex items-center gap-2">
                                    <LanguageLogo language={l} decorative />
                                    {languageName(l)}
                                </span>
                            )}
                        />
                        <MenuArrow />
                    </span>
                }
            />
        </div>
    );
}

/** Where the switch goes: the sidebar's footer, and the mobile menu's. */
const FOOTER = ".nextra-sidebar-footer";

export function SourceLanguageSwitch() {
    const [footers, setFooters] = React.useState<Element[]>([]);
    React.useEffect(() => {
        let current: Element[] = [];
        const find = () => {
            const now = [...document.querySelectorAll(FOOTER)];
            if (
                now.length === current.length &&
                now.every((f, i) => f === current[i])
            ) {
                return;
            }
            current = now;
            setFooters(now);
        };
        find();
        // The sidebar is made again (collapsing it, the mobile menu): find its
        // footer again then; but only then, not on every change to the page
        // (each keystroke in the editor is one).
        const observer = new MutationObserver((records) => {
            const gone = current.some((f) => !f.isConnected);
            const added = records.some((r) =>
                [...r.addedNodes].some(
                    (n) =>
                        n instanceof Element &&
                        (n.matches(FOOTER) || n.querySelector(FOOTER))
                )
            );
            if (gone || added) find();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);
    return footers.map((footer, i) =>
        createPortal(<LanguageSelect />, footer, `source-language-${i}`)
    );
}
