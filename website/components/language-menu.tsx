"use client";
// The menu of source languages: Nextra's Select (nextra/components), the same
// to look at and to use, but not modal. Headless UI's menus are modal unless
// told otherwise, and a modal one stops the page scrolling while it is open,
// which hides the page's scroll bars; Nextra's Select cannot be told.
import cn from "classnames";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "nextra/icons";
import {
    setSourceLanguage,
    useSourceLanguage,
    type SourceLanguage,
} from "./source-language";
import { LANGUAGE_OPTIONS } from "./language-logos";

type AnchorProps = ComponentProps<typeof ListboxOptions>["anchor"];

export function LanguageMenu({
    title,
    className,
    selectedOption,
    anchor = { to: "top start", gap: 10 },
}: {
    title: string;
    /** Where the options open, as Headless UI takes it. */
    anchor?: AnchorProps;
    className?: string;
    /** What the button shows. */
    selectedOption: ReactNode;
}) {
    const language = useSourceLanguage();
    return (
        <Listbox
            value={language}
            onChange={(l: SourceLanguage) => setSourceLanguage(l)}
        >
            <ListboxButton
                title={title}
                className={({ hover, open, focus }) =>
                    cn(
                        "x:cursor-pointer",
                        "x:h-7 x:rounded-md x:px-2 x:text-xs x:font-medium x:transition-colors",
                        open
                            ? "x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/10 x:dark:text-gray-50"
                            : hover
                            ? "x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50"
                            : "x:text-gray-600 x:dark:text-gray-400",
                        focus && "x:nextra-focus",
                        className
                    )
                }
            >
                {selectedOption}
            </ListboxButton>
            <ListboxOptions
                as="ul"
                transition
                modal={false}
                anchor={anchor}
                className={({ open }) =>
                    cn(
                        "x:focus-visible:nextra-focus",
                        open ? "x:opacity-100" : "x:opacity-0",
                        "x:motion-reduce:transition-none x:transition-opacity x:min-w-(--button-width) x:z-30 x:max-h-64 x:rounded-md x:border x:border-black/5 x:backdrop-blur-md x:bg-nextra-bg/70 x:py-1 x:text-sm x:shadow-lg x:dark:border-white/20"
                    )
                }
            >
                {LANGUAGE_OPTIONS.map((option) => (
                    <ListboxOption
                        key={option.id}
                        value={option.id}
                        as={Fragment}
                    >
                        {({ selected, focus }) => (
                            <li
                                className={cn(
                                    focus
                                        ? "x:bg-primary-100 x:text-primary-800 x:dark:text-primary-500 x:dark:bg-primary-500/10"
                                        : "x:text-gray-800 x:dark:text-gray-100",
                                    "x:cursor-pointer x:whitespace-nowrap x:py-1.5 x:px-3",
                                    "x:transition-colors",
                                    selected &&
                                        "x:flex x:items-center x:justify-between x:gap-3"
                                )}
                            >
                                {option.name}
                                {selected && <CheckIcon height="1em" />}
                            </li>
                        )}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}
