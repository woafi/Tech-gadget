import Link from "next/link";
import type { Product } from '@/types';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import Image from "next/image";



interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <div className="group block bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {product.image ? (
                    <Link
                        href={`/product/${product.id}`}
                        className="absolute inset-0 block"
                        tabIndex={-1}
                        aria-hidden
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={index < 3}
                        />
                    </Link>
                ) : (
                    <Link
                        href={`/product/${product.id}`}
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800"
                    >
                        <span className="text-sky-600 dark:text-sky-300 text-4xl font-bold">
                            {product.name.charAt(0)}
                        </span>
                    </Link>
                )}

                {/* Wishlist Button */}
                <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full cursor-pointer backdrop-blur-md shadow-lg transition-all bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                    <FiHeart />
                </button>

                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <div
                        className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm"
                    >
                        Only {product.stock} left
                    </div>
                )}

                {product.stock === 0 && (
                    <div
                        className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm"
                    >
                        Out of Stock
                    </div>
                )}
            </div>
            {/* Content */}
            <div className="p-4">
                {/* Category */}
                {product.category && (
                    <p
                        className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1"
                    >
                        {product.category.name}
                    </p>
                )}

                {/* Name */}
                <Link href={`/product/${product.id}`}>
                    <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-sky-600 dark:hover:text-sky-400 active:text-sky-400 focus:text-sky-400 transition-colors"
                    >
                        {product.name}
                    </h3>
                </Link>
                {/* Description */}
                <p
                    className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                >
                    {product.description}
                </p>

                {/* Price and Cart Button */}
                <div
                    className="flex justify-between items-center"
                >
                    <span
                        className="text-2xl font-bold text-sky-600 dark:text-sky-400"
                    >
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        // onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="px-4 py-2.5 bg-sky-600 cursor-pointer hover:bg-sky-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        <FiShoppingCart size={16} />
                        <span className="text-sm font-medium">Add</span>
                    </button>
                </div>
            </div>
        </div>
    )
}