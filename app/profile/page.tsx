"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiEdit2,
    FiEye,
    FiEyeOff,
    FiHeart,
    FiMail,
    FiPackage,
    FiSave,
    FiUser,
    FiX,
} from "react-icons/fi";

interface ProfileUser {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export default function ProfilePage() {
    // ── Data ──────────────────────────────────────
    const [profile, setProfile] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    // ── Edit Profile ──────────────────────────────
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [updating, setUpdating] = useState(false);

    // ── Change Password ──────────────────────────
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    // ── Fetch profile ─────────────────────────────
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setFetchError("");

        try {
            const response = await fetch("/api/profile");
            if (response.status === 401) {
                setFetchError("Please log in to view your profile.");
                setProfile(null);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await response.json();
            setProfile(data.user);
            setName(data.user.name);
            setEmail(data.user.email);
        } catch {
            setFetchError("Unable to load profile.");
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchProfile();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchProfile]);

    // ── Update profile ────────────────────────────
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setUpdateMessage("");
        setUpdateError("");

        if (name.trim().length < 2) {
            setUpdateError("Name must be at least 2 characters.");
            setUpdating(false);
            return;
        }

        if (!email.includes("@")) {
            setUpdateError("Please provide a valid email address.");
            setUpdating(false);
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to update profile");
            }

            setProfile(data.user);
            setUpdateMessage("Profile updated successfully.");
            setEditing(false);

            // Reset after a few seconds
            window.setTimeout(() => setUpdateMessage(""), 4000);
        } catch (error) {
            setUpdateError(
                error instanceof Error ? error.message : "Failed to update profile",
            );
        } finally {
            setUpdating(false);
        }
    };

    // ── Change password ───────────────────────────
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangingPassword(true);
        setPasswordMessage("");
        setPasswordError("");

        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            setChangingPassword(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setChangingPassword(false);
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to change password");
            }

            setPasswordMessage("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);

            window.setTimeout(() => setPasswordMessage(""), 4000);
        } catch (error) {
            setPasswordError(
                error instanceof Error ? error.message : "Failed to change password",
            );
        } finally {
            setChangingPassword(false);
        }
    };

    const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
        if (
            (event.ctrlKey || event.metaKey) &&
            (event.key === "Enter" || event.key === "NumpadEnter")
        ) {
            event.preventDefault();
            event.currentTarget.requestSubmit();
        }
    };

    const cancelEdit = () => {
        setEditing(false);
        setUpdateError("");
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    };

    const cancelPasswordChange = () => {
        setShowPasswordForm(false);
        setPasswordError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // ── Loading state ─────────────────────────────
    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <FiUser className="mx-auto mb-4 text-sky-500" size={56} />
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading profile...
                    </p>
                </div>
            </main>
        );
    }

    // ── Unauthenticated state ─────────────────────
    if (!profile) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <FiUser className="mx-auto mb-4 text-gray-400" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Not Logged In
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {fetchError || "Please log in to view your profile."}
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                    >
                        Log In
                    </Link>
                </div>
            </main>
        );
    }

    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="mb-6 animate-fade-in-down">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiUser className="text-sky-600 dark:text-sky-400" />
                        My Profile
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Manage your personal information and account settings.
                    </p>
                </div>

                {/* Success / Error messages */}
                {updateMessage && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-slide-in-left">
                        <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            {updateMessage}
                        </p>
                    </div>
                )}

                {passwordMessage && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-slide-in-left">
                        <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            {passwordMessage}
                        </p>
                    </div>
                )}

                {/* Profile Info Card */}
                <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-slide-in-left">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Personal Information
                        </h2>
                        {!editing && (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                            >
                                <FiEdit2 size={16} />
                                Edit
                            </button>
                        )}
                    </div>

                    {updateError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-in-left">
                            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                {updateError}
                            </p>
                        </div>
                    )}

                    {editing ? (
                        <form
                            onSubmit={handleUpdateProfile}
                            onKeyDown={handleFormKeyDown}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FiUser />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={updating}
                                        autoComplete="name"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all disabled:opacity-70"
                                    />
                                </div>
                            </div>

                            <div>
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
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={updating}
                                        autoComplete="email"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all disabled:opacity-70"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-500 disabled:cursor-wait text-white rounded-lg transition-colors font-semibold text-sm shadow-sm"
                                >
                                    <FiSave size={16} />
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={updating}
                                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-70 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-semibold text-sm"
                                >
                                    <FiX size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {profile.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Member since{" "}
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {memberSince}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Password Section */}
                <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-slide-in-right">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Password
                        </h2>
                        {!showPasswordForm && (
                            <button
                                type="button"
                                onClick={() => setShowPasswordForm(true)}
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                            >
                                <FiEdit2 size={16} />
                                Change
                            </button>
                        )}
                    </div>

                    {passwordError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-in-left">
                            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                {passwordError}
                            </p>
                        </div>
                    )}

                    {showPasswordForm ? (
                        <form
                            onSubmit={handleChangePassword}
                            onKeyDown={handleFormKeyDown}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={changingPassword}
                                        autoComplete="current-password"
                                        placeholder="Enter current password"
                                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all disabled:opacity-70"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword((v) => !v)
                                        }
                                        disabled={changingPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-sky-400 transition-colors disabled:cursor-not-allowed"
                                        aria-label={
                                            showCurrentPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={changingPassword}
                                        autoComplete="new-password"
                                        placeholder="At least 6 characters"
                                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all disabled:opacity-70"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((v) => !v)}
                                        disabled={changingPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-sky-400 transition-colors disabled:cursor-not-allowed"
                                        aria-label={
                                            showNewPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showNewPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={changingPassword}
                                        autoComplete="new-password"
                                        placeholder="Re-enter new password"
                                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-sky-500 focus:border-transparent dark:bg-slate-900 dark:text-white transition-all disabled:opacity-70"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword((v) => !v)
                                        }
                                        disabled={changingPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-sky-400 transition-colors disabled:cursor-not-allowed"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-500 disabled:cursor-wait text-white rounded-lg transition-colors font-semibold text-sm shadow-sm"
                                >
                                    <FiSave size={16} />
                                    {changingPassword
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelPasswordChange}
                                    disabled={changingPassword}
                                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-70 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-semibold text-sm"
                                >
                                    <FiX size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            It is recommended to use a strong, unique password
                            for your account.
                        </p>
                    )}
                </section>

                {/* Quick Links */}
                <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-slide-in-left">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Quick Links
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/order"
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                                <FiPackage size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Order History
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    View your past orders
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/wishlist"
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                                <FiHeart size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Wishlist
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Items you have saved
                                </p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
