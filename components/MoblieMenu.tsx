"use client"
import { useState } from "react"
import { FiMenu, FiX } from 'react-icons/fi';


export default function MobileMenu({ entity }: { entity: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (entity === "button") {
        return (
            <>
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </>
        )
    } else {
        return (
            <>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col space-y-4">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `${
                                    isActive
                                        ? 'text-sky-600 dark:text-sky-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
                                } transition-colors`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/shop"
                                className={({ isActive }) => `${
                                    isActive
                                        ? 'text-sky-600 dark:text-sky-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
                                } transition-colors`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shop
                            </NavLink>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/wishlist"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Wishlist
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Cart {cartCount > 0 && `(${cartCount})`}
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left text-red-600 dark:text-red-400"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
                            >
                                {theme === 'light' ? (
                                    <>
                                        <FiMoon /> Dark Mode
                                    </>
                                ) : (
                                    <>
                                        <FiSun /> Light Mode
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return null;
}