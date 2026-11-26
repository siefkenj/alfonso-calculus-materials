"use client";
// The shape of the slides the reader sees, downloads and edits: 4:3, as the
// questions were written for, or 16:9, for a widescreen. One setting for the
// whole site, kept in the browser, and changed by the switch in the sidebar
// (sidebar-settings.tsx). The previews are of either shape: build.ts renders
// the Typst ones, latex-sources/render-previews.ts the LaTeX 16:9 ones.
import { browserSetting } from "./browser-setting";
import { SLIDE_SHAPES, type SlideShape } from "./site";

const setting = browserSetting<SlideShape>(
    "alfonso-slide-shape",
    SLIDE_SHAPES,
    "4:3"
);

export const setSlideShape = setting.set;

/** The slides' shape; 4:3 until the page has loaded. */
export const useSlideShape = setting.use;
