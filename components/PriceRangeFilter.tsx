"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FiDollarSign } from 'react-icons/fi';

interface PriceRangeFilterProps {
    minPrice: number;
    maxPrice: number;
}

export default function PriceRangeFilter({ minPrice: globalMin, maxPrice: globalMax }: PriceRangeFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const paramMin = searchParams.get('minPrice');
    const paramMax = searchParams.get('maxPrice');

    const [localMin, setLocalMin] = useState(paramMin || '');
    const [localMax, setLocalMax] = useState(paramMax || '');

    useEffect(() => {
        setLocalMin(paramMin || '');
        setLocalMax(paramMax || '');
    }, [paramMin, paramMax]);

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        const min = localMin ? String(Number(localMin)) : '';
        const max = localMax ? String(Number(localMax)) : '';

        if (min && Number(min) >= 0) {
            params.set('minPrice', min);
        } else {
            params.delete('minPrice');
        }

        if (max && Number(max) > 0) {
            params.set('maxPrice', max);
        } else {
            params.delete('maxPrice');
        }

        params.delete('page');

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const clearPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('page');
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
        setLocalMin('');
        setLocalMax('');
    };

    const isActive = !!paramMin || !!paramMax;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <FiDollarSign className="text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Filter by Price:</span>
                {isActive && (
                    <button
                        onClick={clearPriceFilter}
                        className="ml-2 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors"
                    >
                        Clear filter
                    </button>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        $
                    </span>
                    <input
                        type="number"
                        min={0}
                        placeholder={`${globalMin}`}
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-28 pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                    />
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">—</span>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        $
                    </span>
                    <input
                        type="number"
                        min={0}
                        placeholder={`${globalMax}`}
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-28 pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                    />
                </div>
                <button
                    onClick={applyPriceFilter}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-all hover:scale-105 shadow-sm"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
