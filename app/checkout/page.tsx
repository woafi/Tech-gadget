"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
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
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [formValues, setFormValues] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        paymentMethod: "sslcommerz",
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
                    setFormValues((current) => ({
                        ...current,
                        fullName: current.fullName || user.username || "",
                        email: current.email || user.email || "",
                        phone: current.phone || user.phoneNumber || "",
                    }));
                }
            }
        } catch {
            setLoadError("Unable to load checkout details. Please try again.");
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const timeoutId = window.setTimeout(() => {
            void fetchCheckoutData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchCheckoutData]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        setFormValues((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
        if (
            (event.ctrlKey || event.metaKey) &&
            (event.key === "Enter" || event.key === "NumpadEnter")
        ) {
            event.preventDefault();
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

                            <form onKeyDown={handleFormKeyDown} className="space-y-6">
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
                                                name="fullName"
                                                type="text"
                                                value={formValues.fullName}
                                                onChange={handleChange}
                                                autoComplete="name"
                                                placeholder="Your name"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="email"
                                                type="email"
                                                value={formValues.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="phone"
                                                type="tel"
                                                value={formValues.phone}
                                                onChange={handleChange}
                                                autoComplete="tel"
                                                placeholder="+1 555 0123"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="city"
                                                type="text"
                                                value={formValues.city}
                                                onChange={handleChange}
                                                autoComplete="address-level2"
                                                placeholder="City"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="address"
                                                type="text"
                                                value={formValues.address}
                                                onChange={handleChange}
                                                autoComplete="street-address"
                                                placeholder="Street address"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="zipCode"
                                                type="text"
                                                value={formValues.zipCode}
                                                onChange={handleChange}
                                                autoComplete="postal-code"
                                                placeholder="10001"
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
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
                                                name="paymentMethod"
                                                value={formValues.paymentMethod}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all border-gray-300 dark:border-gray-600"
                                            >
                                                <option value="sslcommerz">SSLCommerz</option>
                                                <option value="cash_on_delivery">
                                                    Cash on Delivery
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Place Order
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
