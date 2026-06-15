"use client"
import { useState } from "react"
import { FiMenu, FiX,  FiSun, FiMoon } from 'react-icons/fi';
import Navigation from "./Navigation";
import Link from "next/link";


export default function MobileMenu() {
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
                        <Link
                            href="/login"
                            className={`text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors`}
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className={`text-gray-700 dark:text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors`}
                        >
                            Sign Up
                        </Link>

                        <button
                            // onClick={() => {
                            //     toggleTheme();
                            //     setMobileMenuOpen(false);
                            // }}
                            className="text-left text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
                        >
                           
                                    <FiSun /> Light Mode
                           
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

