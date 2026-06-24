import Link from "next/link"
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { getCurrentUser } from "@/lib/auth";

import Navigation from "./Navigation";
import MobileMenu from "./MoblieMenu";
import Theme from "./Theme";

const Navbar = () => {
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

                        
                        <div className="flex items-center space-x-3">
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
                        </div>
                    </div>
                </div>
                <MobileMenu />
            </div>
        </nav>
    )
}

export default Navbar;