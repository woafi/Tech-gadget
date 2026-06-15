"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { slideInLeft } from '@/utils/animations';
import { FiShoppingBag, FiZap, FiTrendingUp } from 'react-icons/fi';

const HeroSection = () => {
    return (
        <>
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 opacity-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="max-w-3xl">
                    <motion.div
                        variants={slideInLeft}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Discover the Latest Tech Gadgets
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-sky-100 mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Shop the newest smartphones, laptops, headphones, and wearables at unbeatable prices. Your tech journey starts here.
                        </motion.p>
                        <motion.div
                            className="flex flex-wrap gap-7 md:gap-4  items-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <FiShoppingBag size={20} />
                                    Shop Now
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                                >
                                    Browse Categories
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Icons */}
            <motion.div
                className="absolute top-1/4 right-10 hidden lg:block"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <FiZap size={60} className="text-white/20" />
            </motion.div>
            <motion.div
                className="absolute bottom-1/4 right-1/4 hidden lg:block"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <FiTrendingUp size={50} className="text-white/20" />
            </motion.div>
        </>
    )
}

export default HeroSection
