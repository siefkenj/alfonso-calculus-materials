"use client";
// A setting for the whole site that the reader chooses (the source language,
// the slides' shape): kept in the browser, the same in every tab, and its
// default until the page has loaded.
import { useSyncExternalStore } from "react";

export function browserSetting<T extends string>(
    key: string,
    values: readonly T[],
    fallback: T
) {
    const listeners = new Set<() => void>();
    let current: T | null = null;

    function read(): T {
        try {
            const stored = localStorage.getItem(key);
            return values.find((v) => v === stored) ?? fallback;
        } catch {
            return fallback;
        }
    }

    function set(value: T) {
        current = value;
        try {
            localStorage.setItem(key, value);
        } catch {}
        listeners.forEach((listener) => listener());
    }

    function subscribe(listener: () => void) {
        listeners.add(listener);
        // Another tab changed it.
        const onStorage = (e: StorageEvent) => {
            if (e.key === key) {
                current = read();
                listener();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => {
            listeners.delete(listener);
            window.removeEventListener("storage", onStorage);
        };
    }

    /** The setting; its default until the page has loaded. */
    function use(): T {
        return useSyncExternalStore(
            subscribe,
            () => (current ??= read()),
            () => fallback
        );
    }

    return { use, set };
}
