"use client";

import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useMounted() {
    return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export default function Theme({ device }: { device: String }) {
    const { setTheme, resolvedTheme } = useTheme();
    const mounted = useMounted();
    const isDark = mounted && resolvedTheme === "dark";

    if (device === "mobile") {
        return (
            <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
            >
                {isDark ? <><FiSun /> Light Mode</> : <><FiMoon /> Dark Mode</>}
            </button>
        )
    }

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
    )
}