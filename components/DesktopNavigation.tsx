"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";


const DesktopNavigation = () => {
    const pathname = usePathname();
    console.log(pathname)
    const activeHome = pathname == "/";

    return (
        <div className="hidden md:flex items-center space-x-8">
            <Link
                href="/"
                className={`${activeHome
                    ? 'text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400'
                    } transition-colors`}
            >
                Home
            </Link>
            <Link
                href="/shop"
                className={`${pathname.includes("/shop")
                    ? 'text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400'
                    } transition-colors`}
            >
                Shop
            </Link>
        </div>
    )
}

export default DesktopNavigation;