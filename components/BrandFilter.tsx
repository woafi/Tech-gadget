"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FiFilter } from 'react-icons/fi';

interface BrandFilterProps {
    brands: string[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedBrand = searchParams.get('brand');

    const handleBrandChange = (brand: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (brand === selectedBrand) {
            params.delete('brand');
        } else {
            params.set('brand', brand);
        }

        params.delete('page');

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const clearBrand = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('brand');
        params.delete('page');
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    if (brands.length === 0) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <FiFilter className="text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Filter by Brand:</span>
                {selectedBrand && (
                    <button
                        onClick={clearBrand}
                        className="ml-2 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors"
                    >
                        Clear filter
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-3">
                {brands.map((brand) => (
                    <button
                        key={brand}
                        onClick={() => handleBrandChange(brand)}
                        className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all ${
                            selectedBrand === brand
                                ? 'bg-sky-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-transform duration-300 hover:scale-105'
                        }`}
                    >
                        {brand}
                    </button>
                ))}
            </div>
        </div>
    );
}
