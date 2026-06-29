"use client"
import { useState } from "react"
import { FiMenu, FiX, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import Link from "next/link";

import { logoutAction } from "@/app/actions/logoutAction";
import type { UserPayload } from "@/lib/auth";

import Navigation from "./Navigation";
import Theme from "./Theme";

export default function MobileMenu({loading, user}:{loading: boolean, user: UserPayload | null}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 absolute top-3 right-3"
            >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col space-y-4">
                        <Navigation entity="mobile" />

                        <div className="border-t border-gray-200 dark:border-gray-700" />

                        {!loading && user ? (
                            <>
                                <Link
                                    href="/wishlist"
                                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors px-2"
                                >
                                    <FiHeart size={18} />
                                    <span>Wishlist</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors px-2"
                                >
                                    <FiShoppingCart size={18} />
                                    <span>Cart</span>
                                </Link>

                                <div className="border-t border-gray-200 dark:border-gray-700" />

                                <Link
                                    href="/profile"
                                    className="text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors px-2"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/orders"
                                    className="text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors px-2"
                                >
                                    Orders
                                </Link>
                                <form action={logoutAction}>
                                    <button
                                        type="submit"
                                        className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-2 cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </form>
                            </>
                        ) : (
                            !loading && (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700" />

                        <div>
                            <Theme device="mobile" />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

