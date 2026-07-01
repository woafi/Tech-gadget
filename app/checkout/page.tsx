"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    FiArrowLeft,
    FiCreditCard,
    FiHome,
    FiMail,
    FiMapPin,
    FiPhone,
    FiShoppingBag,
    FiTruck,
    FiUser,
} from "react-icons/fi";
import {
    checkoutSchema,
    type CheckoutFormData,
} from "@/utils/vaildationCheckoutSchema";

interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: {
        name: string;
        price: number;
        image: string;
        brand: string;
    };
}

interface SessionUser {
    username: string;
    email: string;
    phoneNumber?: string;
}

const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);

const calcSubtotal = (items: CartItem[]) =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            zipCode: "",
            paymentMethod: "sslcommerz",
        },
    });

    const subtotal = useMemo(() => calcSubtotal(cartItems), [cartItems]);
    const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const isEmpty = !isLoading && cartItems.length === 0;

    const fetchCheckoutData = useCallback(async () => {
        setIsLoading(true);
        setLoadError("");

        try {
            const [cartResponse, sessionResponse] = await Promise.all([
                fetch("/api/cart"),
                fetch("/api/auth/session"),
            ]);

            if (cartResponse.status === 401) {
                setLoadError("Please log in before checkout.");
                setCartItems([]);
                return;
            }

            if (!cartResponse.ok) {
                throw new Error("Failed to fetch cart");
            }

            const cartData = await cartResponse.json();
            setCartItems(cartData.items ?? []);

            if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                const user = sessionData.user as SessionUser | null;

                if (user) {
                    setValue("fullName", user.username || "");
                    setValue("email", user.email || "");
                    setValue("phone", user.phoneNumber || "");
                }
            }
        } catch {
            setLoadError("Unable to load checkout details. Please try again.");
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [setValue]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const timeoutId = window.setTimeout(() => {
            void fetchCheckoutData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchCheckoutData]);

    const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
        if (
            (event.ctrlKey || event.metaKey) &&
            (event.key === "Enter" || event.key === "NumpadEnter")
        ) {
            event.preventDefault();
            event.currentTarget.requestSubmit();
        }
    };

    const onSubmit = async (values: CheckoutFormData) => {
        setSubmitError("");

        const result = checkoutSchema.safeParse(values);

        if (!result.success) {
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof CheckoutFormData | undefined;

                if (field) {
                    setError(field, {
                        type: "manual",
                        message: issue.message,
                    });
                }
            });
            return;
        }

        try {
            const response = await fetch("/api/payment/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result.data),
            });

            const data = await response.json();

            if (!response.ok || !data.gatewayUrl) {
                throw new Error(data.error ?? "Unable to initialize payment");
            }

            router.push(data.gatewayUrl);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Unable to initialize payment",
            );
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 animate-fade-in-down">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors mb-4"
                    >
                        <FiArrowLeft />
                        Back to Cart
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiShoppingBag className="text-sky-600 dark:text-sky-400" />
                        Checkout
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Review your items and add shipping details.
                    </p>
                </div>

                {loadError && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 animate-slide-in-left">
                        {loadError}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid lg:grid-cols-[1fr_380px] gap-8 animate-pulse">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-5">
                            <div className="h-6 w-44 bg-gray-200 dark:bg-slate-700 rounded" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div
                                        key={item}
                                        className="h-12 bg-gray-200 dark:bg-slate-700 rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-14 bg-gray-200 dark:bg-slate-700 rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                ) : isEmpty ? (
                    <div className="text-center py-20 opacity-0 animate-fade-in">
                        <FiShoppingBag className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Add items to your cart before starting checkout.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                            <FiArrowLeft />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-slide-in-left">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Shipping Information
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    These fields match the order details saved by the store.
                                </p>
                            </div>

                            {submitError && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 animate-slide-in-left">
                                    {submitError}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                onKeyDown={handleFormKeyDown}
                                className="space-y-6"
                            >
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="fullName"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiUser />
                                            </div>
                                            <input
                                                id="fullName"
                                                type="text"
                                                {...register("fullName")}
                                                autoComplete="name"
                                                placeholder="Your name"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.fullName
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.fullName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiMail />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                {...register("email")}
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.email
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiPhone />
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                {...register("phone")}
                                                autoComplete="tel"
                                                placeholder="+1 555 0123"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.phone
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            City
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiMapPin />
                                            </div>
                                            <input
                                                id="city"
                                                type="text"
                                                {...register("city")}
                                                autoComplete="address-level2"
                                                placeholder="City"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.city
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiHome />
                                            </div>
                                            <input
                                                id="address"
                                                type="text"
                                                {...register("address")}
                                                autoComplete="street-address"
                                                placeholder="Street address"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.address
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="zipCode"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Zip Code
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiMapPin />
                                            </div>
                                            <input
                                                id="zipCode"
                                                type="text"
                                                {...register("zipCode")}
                                                autoComplete="postal-code"
                                                placeholder="10001"
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.zipCode
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                        </div>
                                        {errors.zipCode && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.zipCode.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="paymentMethod"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Payment Method
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <FiCreditCard />
                                            </div>
                                            <select
                                                id="paymentMethod"
                                                {...register("paymentMethod")}
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all ${
                                                    errors.paymentMethod
                                                        ? "border-red-300 dark:border-red-700"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            >
                                                <option value="sslcommerz">SSLCommerz</option>
                                            </select>
                                        </div>
                                        {errors.paymentMethod && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.paymentMethod.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="cursor-pointer w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-500 text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isSubmitting ? "Initializing payment..." : "Place Order"}
                                </button>
                            </form>
                        </section>

                        <aside className="animate-slide-in-right">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-5">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                                                    {item.product.brand}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Qty {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span className="inline-flex items-center gap-2">
                                            <FiTruck />
                                            Shipping
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {shipping === 0 ? "Free" : formatPrice(shipping)}
                                        </span>
                                    </div>
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

                                <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">
                                    Secure checkout powered by SSLCommerz
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}
