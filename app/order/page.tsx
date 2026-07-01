"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FiArrowLeft,
    FiChevronDown,
    FiChevronUp,
    FiPackage,
} from "react-icons/fi";

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: {
        name: string;
        image: string;
    };
}

interface Order {
    id: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
}

const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);

function getStatusClasses(status: string) {
    if (status === "completed") {
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    }

    if (status === "pending") {
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
    }

    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/orders/history");

            if (response.status === 401) {
                setError("Please log in to view your orders.");
                setOrders([]);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data.orders ?? []);
        } catch {
            setError("Unable to load order history.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchOrders();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchOrders]);

    const toggleOrderExpansion = (orderId: number) => {
        setExpandedOrders((prev) => {
            const next = new Set(prev);

            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }

            return next;
        });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <FiPackage className="mx-auto mb-4 text-sky-500" size={56} />
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading your orders...
                    </p>
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <FiPackage className="mx-auto mb-4 text-gray-400" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No Orders Yet
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || "Your order history will appear here."}
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                    >
                        <FiArrowLeft />
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 animate-fade-in-down">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiPackage className="text-sky-600 dark:text-sky-400" />
                        Order History
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Track your latest purchases and payment status.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-sm font-medium text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {orders.map((order, index) => {
                        const isExpanded = expandedOrders.has(order.id);
                        const orderDate = new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            },
                        );

                        return (
                            <article
                                key={order.id}
                                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden opacity-0 animate-fade-in"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Order Header */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Order #{order.id}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Placed on {orderDate}
                                            </p>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                                                {formatPrice(order.total)}
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusClasses(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Payment: {order.paymentStatus}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleOrderExpansion(order.id)}
                                        className="flex items-center gap-2 text-sky-600 cursor-pointer dark:text-sky-400 hover:underline"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <FiChevronUp /> Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <FiChevronDown /> View Details (
                                                {order.items.length} items)
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Order Items (Expanded) */}
                                {isExpanded && (
                                    <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                            Order Items
                                        </h3>
                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg"
                                                >
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/product/${item.productId}`}>
                                                            <h4 className="font-medium text-gray-900 dark:text-white hover:text-sky-600 truncate">
                                                                {item.product.name}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatPrice(item.price)} each
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
