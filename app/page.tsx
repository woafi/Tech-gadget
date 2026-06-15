import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { FiArrowRight, FiShoppingBag, FiZap, FiTrendingUp } from 'react-icons/fi';
import Link from "next/link";
import { getSomeProducts } from "@/lib/product-store";

export default async function Home() {

  const categories = ['Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Accessories'];

  const products = await getSomeProducts()

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
              key={category}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <Link
                href={`/shop?category=${category}`}
                className="block p-6 bg-gray-50 dark:bg-slate-900 rounded-lg text-center hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold transition-transform duration-500 group-hover:rotate-[360deg]">
                  {category.charAt(0)}
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                  {category}
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
            
          )}
        </div>
      </section>
    </div>
  );
}
