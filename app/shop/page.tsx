import { getAllProducts } from "@/lib/product-store";
import ProductCard from "@/components/ProductCard";
import ShopPagination from "@/components/ShopPagination";
import prisma from "@/utils/prisma";

const ITEMS_PER_PAGE = 5;

interface ShopPageProps {
    searchParams?: Promise<{ page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const requestedPage = Number(params?.page);
    const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const totalProducts = await prisma.product.count()
    const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
    // Clamp invalid or oversized page numbers so Prisma always queries a real page.
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const products = await getAllProducts(safeCurrentPage, ITEMS_PER_PAGE)

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

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
                {/* Pagination */}
                <ShopPagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    )
}