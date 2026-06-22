import { Suspense } from "react";
import type { Metadata } from "next";
import { getShopProducts, parseSort } from "@/lib/product-store";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import CategoryFilter from "@/components/categoryFilter";
import BrandFilter from "@/components/BrandFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import ShopSearchBar from "@/components/ShopSearchBar";
import SortFilter from "@/components/SortFilter";
import { FiFilter } from "react-icons/fi";

const ITEMS_PER_PAGE = 12;

export const metadata: Metadata = {
    title: "Shop Products | Tech Gadget",
    description:
        "Browse smartphones, laptops, headphones, smartwatches, and accessories. Filter by category, brand, and price.",
};

interface ShopPageProps {
    searchParams?: Promise<{
        page?: string;
        category?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        q?: string;
        sort?: string;
    }>;
}

function FilterSkeleton() {
    return (
        <div className="animate-pulse flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
            ))}
        </div>
    );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    const requestedPage = Number(params?.page);
    const currentPage =
        Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const filters = {
        category: params?.category || "",
        brand: params?.brand || "",
        minPrice: params?.minPrice || "",
        maxPrice: params?.maxPrice || "",
        q: params?.q || "",
        sort: parseSort(params?.sort),
    };

    const { products, totalProducts, totalPages, safePage, brands, priceRange, categories } =
        await getShopProducts(currentPage, ITEMS_PER_PAGE, filters);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Shop Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {totalProducts} product{totalProducts !== 1 ? "s" : ""} · Page{" "}
                        {safePage} of {totalPages}
                    </p>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Suspense fallback={<FilterSkeleton />}>
                        <ShopSearchBar />
                    </Suspense>
                    <Suspense fallback={<div className="h-10 w-40 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />}>
                        <SortFilter />
                    </Suspense>
                </div>

                <div className="mb-8 opacity-0 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Filter by Category:
                        </span>
                    </div>
                    <Suspense fallback={<FilterSkeleton />}>
                        <CategoryFilter categories={categories} />
                    </Suspense>
                </div>

                {brands.length > 0 && (
                    <div className="mb-8 opacity-0 animate-fade-in">
                        <Suspense fallback={<FilterSkeleton />}>
                            <BrandFilter brands={brands} />
                        </Suspense>
                    </div>
                )}

                <div className="mb-8 opacity-0 animate-fade-in">
                    <Suspense fallback={<FilterSkeleton />}>
                        <PriceRangeFilter
                            minPrice={priceRange.minPrice}
                            maxPrice={priceRange.maxPrice}
                        />
                    </Suspense>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-16 opacity-0 animate-fade-in">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No products found matching your filters.
                        </p>
                    </div>
                )}

                <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    queryParamKey="page"
                />
            </div>
        </div>
    );
}
