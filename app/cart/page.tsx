"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiMinus, FiPlus, FiXCircle } from "react-icons/fi";
import { useCartStore } from "@/stores/cart-store";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
    brand: string;
    stock: number;
  };
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartItems(data.items ?? []);
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (id: number, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      await fetchCart();
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [fetchCart]);

  const clearAll = useCallback(async () => {
    setUpdatingItems((prev) => new Set(prev).add(-1));
    try {
      const res = await fetch("/api/cart?all=true", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear cart");
      await fetchCart();
      useCartStore.getState().fetchCount();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      await fetchCart();
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(-1);
        return next;
      });
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (id: number) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      await fetchCart();
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [fetchCart]);

  const isEmpty = !isLoading && cartItems.length === 0;

  const subtotal = calcSubtotal(cartItems);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiShoppingBag className="text-blue-600 dark:text-blue-400" />
            Shopping Cart
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {isLoading ? "Loading..." : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex gap-4 animate-pulse"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="flex gap-3">
                    <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 opacity-0 animate-fade-in">
            <FiShoppingBag className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you have not added anything yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {cartItems.map((item, index) => {
                const isUpdating = updatingItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex gap-4 opacity-0 animate-fade-in ${isUpdating ? "opacity-60 pointer-events-none" : ""}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {item.product.brand}
                      </p>
                      <Link
                        href={`/product/${item.productId}`}
                        className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Stock: {item.product.stock} available
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="p-1.5 text-red-400 dark:text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <FiArrowLeft />
                  Continue Shopping
                </Link>

                <button
                  onClick={clearAll}
                  disabled={updatingItems.has(-1)}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiXCircle size={16} />
                  Clear All
                </button>
              </div>
            </div>

            <div className="w-full lg:w-80 opacity-0 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
                      Free shipping on orders over $50.00
                    </p>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  <hr className="border-gray-200 dark:border-slate-700" />

                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  disabled
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-70"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
                  Secure checkout powered by SSLCommerz
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
