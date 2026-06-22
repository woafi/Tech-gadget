export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="mb-8">
                    <div className="h-9 w-56 bg-gray-200 dark:bg-slate-700 rounded-lg mb-2" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>

                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="h-12 w-full max-w-md bg-gray-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-10 w-40 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                </div>

                <div className="mb-8 flex flex-wrap gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
                                <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
                                <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-7 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
                                    <div className="h-10 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
