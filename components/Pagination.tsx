"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Previous Button */}
            <motion.button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm'
                    }`}
                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
                <FiChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <motion.button
                            type="button"
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-[40px] px-3 py-2 cursor-pointer rounded-lg font-medium transition-all ${isActive
                                ? 'bg-sky-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm'
                                }`}
                            whileHover={!isActive ? { scale: 1.05, y: -2 } : {}}
                            whileTap={!isActive ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {pageNum}
                        </motion.button>
                    );
                })}
            </div>

            {/* Next Button */}
            <motion.button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm'
                    }`}
                whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight size={18} />
            </motion.button>
        </motion.div>
    );
};

export default Pagination;
