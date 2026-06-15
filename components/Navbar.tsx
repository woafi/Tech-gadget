import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                </div>
            </div>
        </nav>
    )
}

export default Navbar;