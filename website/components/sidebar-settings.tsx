"use client";
// The site-wide settings, beside the light/dark switch at the foot of the
// sidebar (and of the mobile menu): the source language (LaTeX or Typst) and
// the slides' shape (4:3 or 16:9). Nextra has no slot there, so they are put
// into the sidebar's footer with a portal; should Nextra rename that footer,
// they just do not show (the questions' own menus still set the language).
import React from "react";
import { createPortal } from "react-dom";
import { LanguageMenu, SettingMenu } from "./language-menu";
import { useSourceLanguage } from "./source-language";
import { setSlideShape, useSlideShape } from "./slide-shape";
import { SLIDE_SHAPES, type SlideShape } from "./site";
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
                                    <span className="setting-name">
                                        {languageName(l)}
                                    </span>
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

/**
 * A slide of `shape`, as an outline with its title bar: 4:3 or 16:9, as tall
 * as each other.
 */
function SlideShapeIcon({ shape }: { shape: SlideShape }) {
    const width = shape === "16:9" ? (12 * 16) / 9 : 16;
    const x = (24 - width) / 2;
    return (
        <svg
            className="slide-shape-icon"
            viewBox="0 0 24 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
        >
            <rect x={x} y={2} width={width} height={12} rx={1.5} />
            <path d={`M${x} 5.5h${width}`} />
        </svg>
    );
}

const SHAPE_OPTIONS = SLIDE_SHAPES.map((shape) => ({
    id: shape,
    name: (
        <span className="setting-option">
            <SlideShapeIcon shape={shape} />
            {shape === "16:9" ? "16:9 widescreen" : "4:3"}
        </span>
    ),
}));

function ShapeSelect() {
    const shape = useSlideShape();
    return (
        <SettingMenu<SlideShape>
            value={shape}
            onChange={setSlideShape}
            options={SHAPE_OPTIONS}
            title={`Slide shape: ${shape}. Choose 4:3 or 16:9 (widescreen) for the slides you see, download and edit`}
            anchor="top start"
            selectedOption={
                <span className="flex items-center gap-2">
                    <SlideShapeIcon shape={shape} />
                    {/* As wide for either, so that nothing moves. */}
                    <span className="setting-name slide-shape-name">
                        {shape}
                    </span>
                    <MenuArrow />
                </span>
            }
        />
    );
}

/** Where the settings go: the sidebar's footer, and the mobile menu's. */
const FOOTER = ".nextra-sidebar-footer";

export function SidebarSettings() {
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
        createPortal(
            <div className="sidebar-settings">
                <LanguageSelect />
                <ShapeSelect />
            </div>,
            footer,
            `sidebar-settings-${i}`
        )
    );
}
