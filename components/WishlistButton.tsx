"use client"

import { useState, useEffect } from "react"
import { FiHeart, FiCheck } from "react-icons/fi"
import { toast } from "sonner"

interface WishlistButtonProps {
    productId: number
    disabled?: boolean
    className?: string
    classNameActive?: string
    iconOnly?: boolean
}

function isInWishlistLocal(productId: number): boolean {
    const raw = localStorage.getItem("wishlist")
    const wishlist: number[] = raw ? JSON.parse(raw) : []
    return wishlist.includes(productId)
}

function toggleWishlistLocal(productId: number): boolean {
    const raw = localStorage.getItem("wishlist")
    const wishlist: number[] = raw ? JSON.parse(raw) : []
    const index = wishlist.indexOf(productId)
    if (index !== -1) {
        wishlist.splice(index, 1)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        window.dispatchEvent(new Event("wishlist-updated"))
        return false
    } else {
        wishlist.push(productId)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        window.dispatchEvent(new Event("wishlist-updated"))
        return true
    }
}

async function toggleWishlistApi(productId: number): Promise<"added" | "removed" | null> {
    const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
    })
    if (!res.ok && res.status !== 401) {
        throw new Error("Failed to toggle wishlist")
    }
    if (res.status === 401) return null
    const data = await res.json()
    return data.action as "added" | "removed"
}

export default function WishlistButton({
    productId,
    disabled = false,
    className = "",
    classNameActive = "",
    iconOnly = false,
}: WishlistButtonProps) {
    const [inWishlist, setInWishlist] = useState(false)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        setInWishlist(isInWishlistLocal(productId))
    }, [productId])

    useEffect(() => {
        const handler = () => setInWishlist(isInWishlistLocal(productId))
        window.addEventListener("wishlist-updated", handler)
        return () => window.removeEventListener("wishlist-updated", handler)
    }, [productId])

    const handleClick = async () => {
        if (disabled) return

        const prev = inWishlist
        // Optimistic update
        setInWishlist(!prev)

        let now: boolean

        const action = await toggleWishlistApi(productId).catch(() => null)
        if (action === null) {
            // Unauthenticated — use local storage
            now = toggleWishlistLocal(productId)
        } else {
            // API succeeded — sync local storage silently
            now = action === "added"
            const raw = localStorage.getItem("wishlist")
            const wishlist: number[] = raw ? JSON.parse(raw) : []
            if (now) {
                if (!wishlist.includes(productId)) wishlist.push(productId)
            } else {
                const idx = wishlist.indexOf(productId)
                if (idx !== -1) wishlist.splice(idx, 1)
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist))
        }

        setInWishlist(now)

        if (now !== prev) {
            toast.success(now ? "Added to wishlist!" : "Removed from wishlist")
        }

        setAnimating(true)
        setTimeout(() => setAnimating(false), 600)
    }

    const activeClass = inWishlist ? classNameActive || "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20" : ""

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`${className} ${activeClass} transition-all duration-200 cursor-pointer ${animating ? "scale-110" : "scale-100"}`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {inWishlist ? <FiCheck size={16} className="transition-transform duration-200" /> : <FiHeart size={16} className="transition-transform duration-200" />}
            {!iconOnly && (
                <span className="text-sm font-medium">{inWishlist ? "Saved" : "Save"}</span>
            )}
        </button>
    )
}
