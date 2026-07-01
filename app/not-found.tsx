import Link from "next/link";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

export default function NotFoundPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
            <div className="text-center max-w-lg animate-fade-in">
                <div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6 animate-scale-in"
                    aria-hidden="true"
                >
                    <FiAlertTriangle
                        className="text-amber-600 dark:text-amber-400"
                        size={48}
                    />
                </div>

                <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white mb-2">
                    404
                </h1>

                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </p>

                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    The page you are looking for does not exist or has been moved.
                    Check the URL or head back home.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl transition-all font-semibold text-lg shadow-md hover:shadow-lg active:scale-[0.97]"
                >
                    <FiHome size={22} />
                    Go Home
                </Link>
            </div>
        </main>
    );
}
