"use client";

import { useSearchParams } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { getOAuthErrorMessage } from "@/lib/oauth-errors";

export default function OAuthErrorBanner() {
    const searchParams = useSearchParams();
    const message = getOAuthErrorMessage(searchParams.get("error"));

    if (!message) {
        return null;
    }

    return (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-in-left">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {message}
            </p>
        </div>
    );
}
