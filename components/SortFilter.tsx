"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"
import type { ProductSort } from "@/lib/product-store"

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A–Z" },
]

export default function SortFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentSort = (searchParams.get("sort") as ProductSort) || "newest"

    const handleSortChange = (sort: ProductSort) => {
        const params = new URLSearchParams(searchParams.toString())

        if (sort === "newest") {
            params.delete("sort")
        } else {
            params.set("sort", sort)
        }

        params.delete("page")

        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <div className="flex items-center gap-2">
            <FiArrowDown className="text-gray-600 dark:text-gray-400 shrink-0" />
            <label htmlFor="sort-filter" className="sr-only">
                Sort products
            </label>
            <select
                id="sort-filter"
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value as ProductSort)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FiArrowUp className="text-gray-600 dark:text-gray-400 shrink-0 opacity-0 w-0" aria-hidden />
        </div>
    )
}
