import { FiArrowRight, FiShoppingBag, FiZap, FiTrendingUp } from 'react-icons/fi';
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";

import { getSomeProducts, getAllCategories } from "@/lib/product-store";

export default async function Home() {

  const [products, categories] = await Promise.all([
    getSomeProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-600 via-indigo-500 to-pink-500 text-white overflow-hidden">
        <HeroSection />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-500">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-500 delay-100">
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="block p-6 bg-gray-50 dark:bg-slate-900 rounded-lg text-center hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold transition-transform duration-500 group-hover:rotate-[360deg]">
                  {category.name.charAt(0)}
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                  {category.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trending Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Check out our most popular items
              </p>
            </div>
            <div className="group">
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold transition-all duration-300"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300">View All</span>
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
          {products ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center text-xl font-bold">
              <span>There is no product</span>
            </div>
          )}
          <div
            className="mt-8 text-center md:hidden"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold"
            >
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 bg-gradient-to-r from-sky-600 to-purple-600 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-10"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Upgrade Your Tech?
          </h2>
          <p
            className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto"
          >
            Sign up today and get exclusive access to deals, new arrivals, and personalized recommendations.
          </p>
          <div>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              Get Started
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
