"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiXCircle } from "react-icons/fi";

function PaymentFailedContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const handleFailure = async () => {
                const orderId = searchParams.get("order_id");

                if (orderId) {
                    try {
                        await fetch(`/api/payment/failure?order_id=${orderId}`, {
                            method: "POST",
                        });
                    } catch (err) {
                        console.error("Error updating payment failure:", err);
                    }
                }

                // Clear the pending order from sessionStorage
                sessionStorage.removeItem("pendingOrder");
            };

            void handleFailure();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [searchParams]);

    return (
        <div className="text-center max-w-md">
            <FiXCircle className="mx-auto mb-4 text-red-500" size={80} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Unfortunately, your payment could not be processed. Please try again or
                contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/checkout"
                    className="inline-flex justify-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                    Try Again
                </Link>
                <Link
                    href="/shop"
                    className="inline-flex justify-center border-2 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Suspense fallback={null}>
                <PaymentFailedContent />
            </Suspense>
        </main>
    );
}
