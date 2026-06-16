import { getAllProducts } from "@/lib/product-store";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import prisma from "@/utils/prisma";
import CategoryPage from "@/components/categoryFilter";


import { FiFilter, FiSearch } from 'react-icons/fi';
import { Product } from "@prisma/client/edge";

const ITEMS_PER_PAGE = 12;

interface ShopPageProps {
    searchParams?: Promise<{
        page?: string;
        category?: string;
        brand?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    // For Page Number
    const requestedPage = Number(params?.page);
    // for category
    const category = params?.category || "";

    const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    // Build where clause for filtering
    const whereClause: any = {};

    // Category filter
    if (category) {
        whereClause.category = {
            name: category as string,
        };
    }

    // Get total count for pagination metadata
    const totalProducts = await prisma.product.count({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });

    const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const products = await getAllProducts(safeCurrentPage, ITEMS_PER_PAGE, whereClause)



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Shop Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Page {safeCurrentPage} of {totalPages}
                    </p>
                </div>

                {/* Filters */}
                <div
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">Filter by Category:</span>
                    </div>
                    <CategoryPage />
                </div>

                {/* Brand Filter */}
                    {(categoryFilter || brands.popular.length > 0 || brands.others.length > 0) && (
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <BrandFilter
                                brands={brands}
                                selectedBrand={selectedBrand}
                                onBrandChange={handleBrandChange}
                            />
                        </motion.div>
                    )}

                    {/* Price Range Filter */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <PriceRangeFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onMinChange={handleMinPriceChange}
                            onMaxChange={handleMaxPriceChange}
                        />
                    </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: Product, index: number) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    queryParamKey="page"
                />
            </div>
        </div>
    )
}