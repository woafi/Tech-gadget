"use client";

import Link from "next/link"
import { FiShoppingCart, FiHeart, FiUser, FiSearch } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/actions/logoutAction"
import type { UserPayload } from "@/lib/auth";
import { useCartStore } from "@/stores/cart-store";
import Navigation from "./Navigation";
import MobileMenu from "./MoblieMenu";
import Theme from "./Theme";


const Navbar = () => {

    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const cartCount = useCartStore((state) => state.count);
    const fetchCartCount = useCartStore((state) => state.fetchCount);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/auth/session");

                if (!res.ok) {
                    throw new Error("Failed to fetch session");
                }

                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
        fetchCartCount();
    }, [pathname, fetchCartCount]);

    useEffect(() => {
        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener("cart-updated", handleCartUpdate);
        return () => window.removeEventListener("cart-updated", handleCartUpdate);
    }, [fetchCartCount]);

    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                                <span><img src="/icon.png" alt="" /></span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Tech Gadgets
                            </span>
                        </Link>
                        <Navigation entity="desktop" />
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/shop"
                                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Search products"
                            >
                                <FiSearch size={20} />
                            </Link>
                            <Theme device="" />
                        </div>
                    </div>
                    <MobileMenu loading={loading} user={user} />
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                            <span><img src="/icon.png" alt="" /></span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Tech Gadgets
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <Navigation entity="desktop" />

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search Icon */}
                        <Link
                            href="/shop"
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Search products"
                        >
                            <FiSearch size={20} />
                        </Link>

                        {/* Theme Toggle */}
                        <Theme device="" />

                        {!loading && user ? (
                            <>
                                <Link
                                    href="/wishlist"
                                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="Wishlist"
                                >
                                    <FiHeart size={20} />
                                </Link>
                                <Link
                                    href="/cart"
                                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative"
                                    aria-label="Shopping cart"
                                >
                                    <FiShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-sky-600 rounded-full">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Dropdown button */}
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                        <FiUser size={20} />
                                        <span className="text-sm font-medium">{user.username}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/order"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            Orders
                                        </Link>
                                        <form action={logoutAction}>
                                            <button
                                                type="submit"
                                                className="w-full text-left cursor-pointer px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                                            >
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                {!loading && (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <MobileMenu loading={loading} user={user} />
            </div>
        </nav>
    )
}

export default Navbar;