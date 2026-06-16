"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const categories: String[] = ['All', 'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Accessories'];

// 2. Apply the interface to the destructured props object
export default function CategoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleCategoryChange = (category: string) => {
        // 1. Create a mutable copy of the current search params
        const params = new URLSearchParams(searchParams.toString());

        if (category === 'All') {
            // Remove the category parameter if 'All' is selected
            params.delete('category');
        } else {
            // Otherwise, set the new category
            params.set('category', category);
        }

        // 2. Reset the brand filter when category changes
        params.delete('brand'); // If brand is also tracked in the URL, remove it here

        // 3. Update the browser URL with the new parameters
        // scroll: false prevents the page from jumping back to the top
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Get the 'category' parameter
    const categoryFilter = searchParams.get('category');

    return (
        <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
                <button
                    key={category.toString()}
                    onClick={() => handleCategoryChange(category.toString())}
                    className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all ${(category === 'All' && !categoryFilter) || category === categoryFilter
                            ? 'bg-sky-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-transform duration-300 hover:scale-105'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}