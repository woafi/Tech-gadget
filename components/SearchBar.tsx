"use client"
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Search products...',
    className = '',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Trigger search when debounced query changes
    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const handleClear = () => {
        setSearchQuery('');
        setDebouncedQuery('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-3 focus:outline-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Clear search"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>
            {searchQuery && (
                <div className="absolute left-0 right-0 top-full mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {debouncedQuery !== searchQuery ? (
                        <span className="animate-pulse">Searching...</span>
                    ) : (
                        <span>Press Enter or wait to search</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
