import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FiArrowLeft, FiHeart, FiPackage, FiTag } from "react-icons/fi";
import { getAllProductIds, getProductById } from "@/lib/product-store";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamicParams = false;

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const products = await getAllProductIds();

    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
        return { title: "Product Not Found | Tech Gadget" };
    }

    const product = await getProductById(productId);

    if (!product) {
        return { title: "Product Not Found | Tech Gadget" };
    }

    return {
        title: `${product.name} | Tech Gadget`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
        notFound();
    }

    //for product fectch
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const inStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock < 10;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:underline mb-8 transition-colors"
                >
                    <FiArrowLeft size={18} />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="relative aspect-square bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800">
                                <span className="text-sky-600 dark:text-sky-300 text-8xl font-bold">
                                    {product.name.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {product.category && (
                            <Link
                                href={`/shop?category=${encodeURIComponent(product.category.name)}`}
                                className="text-sm text-sky-600 dark:text-sky-400 font-medium mb-2 hover:underline w-fit"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1.5">
                                <FiTag size={16} />
                                {product.brand}
                                {product.model && ` · ${product.model}`}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <FiPackage size={16} />
                                {inStock
                                    ? lowStock
                                        ? `Only ${product.stock} left`
                                        : "In stock"
                                    : "Out of stock"}
                            </span>
                        </div>

                        <div className="text-4xl font-bold text-sky-600 dark:text-sky-400 mb-8">
                            ${product.price.toFixed(2)}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <AddToCartButton
                                productId={product.id}

                                disabled={!inStock}
                                label="Add to Cart"
                                className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium cursor-pointer"
                            />
                            <button
                                type="button"
                                aria-label="Add to wishlist"
                                className="px-4 py-3.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 transition-colors cursor-pointer"
                            >
                                <FiHeart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
