"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface CategoryFilterProps {
    categories: { id: number; name: string }[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }

        params.delete("brand");
        params.delete("page");

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const categoryFilter = searchParams.get("category");

    return (
        <div className="flex flex-wrap gap-3">
            <button
                type="button"
                onClick={() => handleCategoryChange("All")}
                aria-pressed={!categoryFilter}
                className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all ${
                    !categoryFilter
                        ? "bg-sky-600 text-white shadow-lg"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-transform duration-300 hover:scale-105"
                }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.name)}
                    aria-pressed={category.name === categoryFilter}
                    className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all ${
                        category.name === categoryFilter
                            ? "bg-sky-600 text-white shadow-lg"
                            : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-transform duration-300 hover:scale-105"
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
