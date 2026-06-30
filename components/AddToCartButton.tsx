"use client"

import { useState } from "react"
import { FiShoppingCart, FiCheck } from "react-icons/fi"
import { toast } from "sonner"

interface AddToCartButtonProps {
    productId: number
    disabled?: boolean
    className?: string
    label?: string
}

function addToCartLocal(productId: number) {
    const raw = localStorage.getItem("cart")
    const cart: Record<string, number> = raw ? JSON.parse(raw) : {}
    const key = String(productId)
    cart[key] = (cart[key] ?? 0) + 1
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
}

async function addToCartApi(productId: number) {
    const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
    })
    if (!res.ok && res.status !== 401) {
        throw new Error("Failed to add to cart")
    }
    return res.ok
}

export default function AddToCartButton({
    productId,
    disabled = false,
    className = "",
    label = "Add",
}: AddToCartButtonProps) {
    const [added, setAdded] = useState(false)

    const handleClick = async () => {
        if (disabled) return
        const ok = await addToCartApi(productId).catch(() => false)
        if (!ok) {
            addToCartLocal(productId)
        } else {
            window.dispatchEvent(new Event("cart-updated"))
        }
        toast.success("Product added to cart!")
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={className}
            aria-label={added ? "Added to cart" : "Add to cart"}
        >
            {added ? <FiCheck size={16} /> : <FiShoppingCart size={16} />}
            <span className="text-sm font-medium">{added ? "Added" : label}</span>
        </button>
    )
}
