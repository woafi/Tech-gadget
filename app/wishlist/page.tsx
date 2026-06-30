"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import AddToCartButton from "@/components/AddToCartButton";

interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    brand: string;
    stock: number;
    description: string;
    category?: {
      name: string;
    } | null;
  };
  createdAt: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlistItems(data.items ?? []);

      // Sync local storage
      const ids: number[] = (data.items ?? []).map((item: WishlistItem) => item.productId);
      localStorage.setItem("wishlist", JSON.stringify(ids));
    } catch {
      // API unavailable — show empty state (local storage just stores IDs, no product details)
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    const handler = () => fetchWishlist();
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, [fetchWishlist]);

  const removeItem = useCallback(async (id: number, productId: number) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/wishlist?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchWishlist();
      window.dispatchEvent(new Event("wishlist-updated"));
      toast.success("Removed from wishlist");
    } catch {
      // Fallback: remove from local storage
      const raw = localStorage.getItem("wishlist");
      const ids: number[] = raw ? JSON.parse(raw) : [];
      const updated = ids.filter((pid) => pid !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlist-updated"));
      await fetchWishlist();
      toast.success("Removed from wishlist");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [fetchWishlist]);

  const isEmpty = !isLoading && wishlistItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiHeart className="text-red-500 dark:text-red-400" />
            My Wishlist
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {isLoading
              ? "Loading..."
              : `${wishlistItems.length} item${wishlistItems.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200 dark:bg-slate-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-8 w-full bg-gray-200 dark:bg-slate-700 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20">
            <FiHeart className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Save items you love and come back to them later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiShoppingBag />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => {
              const isRemoving = removingIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isRemoving ? "opacity-50 scale-95 pointer-events-none" : ""
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative aspect-square block bg-gray-100 dark:bg-slate-700 group"
                  >
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30">
                        <span className="text-red-400 dark:text-red-300 text-5xl font-bold">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.id, item.productId);
                      }}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>

                    {/* Stock Badge */}
                    {item.product.stock === 0 && (
                      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                        Out of Stock
                      </div>
                    )}
                    {item.product.stock > 0 && item.product.stock < 10 && (
                      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                        Only {item.product.stock} left
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    {item.product.category && (
                      <p className="text-xs text-red-500 dark:text-red-400 font-medium mb-1">
                        {item.product.category.name}
                      </p>
                    )}

                    <Link href={`/product/${item.productId}`}>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {item.product.brand}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>

                    <div className="mt-3">
                      <AddToCartButton
                        productId={item.productId}
                        disabled={item.product.stock === 0}
                        label="Add to Cart"
                        className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium cursor-pointer text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
