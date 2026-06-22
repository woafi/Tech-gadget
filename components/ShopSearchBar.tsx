"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { FiSearch, FiX } from "react-icons/fi"

export default function ShopSearchBar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const urlQuery = searchParams.get("q") ?? ""
    const [searchQuery, setSearchQuery] = useState(urlQuery)
    const [debouncedQuery, setDebouncedQuery] = useState(urlQuery)

    useEffect(() => {
        setSearchQuery(urlQuery)
        setDebouncedQuery(urlQuery)
    }, [urlQuery])

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        if (debouncedQuery === urlQuery) return

        const params = new URLSearchParams(searchParams.toString())
        const trimmed = debouncedQuery.trim()

        if (trimmed) {
            params.set("q", trimmed)
        } else {
            params.delete("q")
        }

        params.delete("page")

        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedQuery, urlQuery, searchParams, router, pathname])

    const handleClear = () => {
        setSearchQuery("")
        setDebouncedQuery("")
    }

    return (
        <div className="relative w-full max-w-md">
            <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
            />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-12 py-3 focus:outline-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                >
                    <FiX size={20} />
                </button>
            )}
        </div>
    )
}
