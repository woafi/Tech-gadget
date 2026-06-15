import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer= () => {
    return (
        <footer className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                                <span><img src="/icon.png" alt="" /></span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Tech Gadgets
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your one-stop shop for the latest tech gadgets and accessories.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Wishlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Account
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/profile" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-sm">Help Center</li>
                            <li className="text-sm">Shipping Info</li>
                            <li className="text-sm">Returns</li>
                            <li className="text-sm">Contact Us</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    {/* Social Media */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                            <FiGithub size={20} />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                            <FiTwitter size={20} />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                            <FiLinkedin size={20} />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                            <FiMail size={20} />
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} Tech Gadgets. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
