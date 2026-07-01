"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const validatePayment = async () => {
                const valId = searchParams.get("val_id");
                const transactionId = searchParams.get("tran_id");
                const orderId = searchParams.get("order_id");

                // tran_id and order_id are required, val_id is optional (only from IPN)
                if (!transactionId || !orderId) {
                    setError("Invalid payment parameters: Missing tran_id or order_id");
                    setValidating(false);
                    return;
                }

                try {
                    const params = new URLSearchParams({
                        tran_id: transactionId,
                        order_id: orderId,
                    });

                    // Build params object, only include val_id if it exists
                    if (valId) {
                        params.set("val_id", valId);
                    }

                    const response = await fetch(`/api/payment/validate?${params}`);
                    const data = await response.json();

                    if (data.success) {
                        // Clear the pending order from sessionStorage
                        sessionStorage.removeItem("pendingOrder");
                        // Clear the cart
                        window.dispatchEvent(new Event("cart-updated"));
                        setValidating(false);
                    } else {
                        setError("Payment validation failed");
                        setValidating(false);
                    }
                } catch {
                    setError("Failed to validate payment");
                    setValidating(false);
                }
            };

            void validatePayment();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [searchParams]);

    if (validating) {
        return (
            <div className="text-center">
                <FiLoader className="mx-auto mb-4 text-sky-500 animate-spin" size={60} />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Validating Payment...
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we confirm your payment.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Validation Error
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <Link
                    href="/shop"
                    className="inline-flex bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center max-w-md">
            <FiCheckCircle className="mx-auto mb-4 text-green-500" size={80} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for your purchase. Your order has been confirmed and is being
                processed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/order"
                    className="inline-flex justify-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                    View Orders
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

export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Suspense fallback={null}>
                <PaymentSuccessContent />
            </Suspense>
        </main>
    );
}
