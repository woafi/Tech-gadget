"use client";

import { useActionState, useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
    FiAlertCircle,
    FiEye,
    FiEyeOff,
    FiLock,
    FiMail,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import { loginAction } from "@/app/actions/loginAction";

const initialState = {
    message: "",
    fieldErrors: {
        email: "",
        password: "",
    },
    values: {
        email: "",
        password: "",
    },
};

export default function Login() {
    const [state, formAction, pending] = useActionState(
        loginAction,
        initialState,
    );
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
        if (
            (event.ctrlKey || event.metaKey) &&
            (event.key === "Enter" || event.key === "NumpadEnter")
        ) {
            event.preventDefault();
            event.currentTarget.requestSubmit();
        }
    };

    return (
        <main className="min-h-screen flex bg-white dark:bg-slate-900">
            {/* Left Section - Branding */}
            <section className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-sky-700 items-center justify-center p-12 relative overflow-hidden animate-slide-in-left">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_42%,rgba(255,255,255,0.12)_100%)]" />
                <div
                    className="max-w-md text-white relative z-10 animate-scale-in"
                >
                    <h1
                        className="text-4xl font-bold mb-6 animate-fade-in"
                    >
                        Welcome Back
                    </h1>
                    <p
                        className="text-lg text-purple-100 animate-fade-in"
                    >
                        Log in to track your orders, manage your wishlist, and
                        pick up right where you left off.
                    </p>
                </div>
            </section>

            {/* Right Section - Form */}
            <section className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-slate-900 animate-slide-in-right">
                <div className="w-full max-w-md">
                    <div
                        className="mb-8 animate-fade-in-down"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Log In
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to continue to your account
                        </p>
                    </div>

                    {state.message && (
                        <div
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-in-left"
                        >
                            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                                {state.message}
                            </p>
                        </div>
                    )}

                    <div
                        className="mb-6 animate-fade-in"
                    >
                        <button
                            type="button"
                            disabled
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-500 dark:text-gray-400 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <FcGoogle size={24} />
                            <span>Log in with Google</span>
                        </button>
                    </div>

                    <div
                        className="relative mb-6 animate-fade-in"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
                                Or log in with email
                            </span>
                        </div>
                    </div>

                    <div
                        className="animate-fade-in"
                    >
                        <form
                            action={formAction}
                            onKeyDown={handleFormKeyDown}
                            className="space-y-6"
                        >
                            <div
                                className="animate-fade-in"
                            >
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FiMail />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        defaultValue={state.values.email}
                                        disabled={pending}
                                        autoComplete="email"
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all disabled:opacity-70 ${
                                            state.fieldErrors.email
                                                ? "border-red-300 dark:border-red-700"
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    />
                                </div>
                                {state.fieldErrors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {state.fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            <div
                                className="animate-fade-in"
                            >
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FiLock />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        defaultValue={state.values.password}
                                        disabled={pending}
                                        autoComplete="current-password"
                                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all disabled:opacity-70 ${
                                            state.fieldErrors.password
                                                ? "border-red-300 dark:border-red-700"
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        disabled={pending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-300 text-gray-400 hover:text-gray-600 dark:hover:text-sky-400 disabled:cursor-not-allowed"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                                {state.fieldErrors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {state.fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <div
                                className="animate-fade-in"
                            >
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="cursor-pointer w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-500 disabled:cursor-wait text-white rounded-lg transition-colors font-semibold shadow-sm"
                                >
                                    {pending ? "Logging in..." : "Log In"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div
                        className="mt-6 text-center animate-fade-in"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-sky-600 dark:text-sky-400 font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
