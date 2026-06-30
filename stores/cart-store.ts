"use client"

import { createStore } from "@/stores"

interface CartSlice {
  count: number
  setCount: (count: number) => void
  fetchCount: () => Promise<void>
}

/**
 * Try to get cart count from API. Falls back to localStorage if user is
 * unauthenticated or API is unavailable.
 */
async function getCartCount(): Promise<number> {
  try {
    const res = await fetch("/api/cart")
    if (!res.ok) throw new Error("Failed to fetch cart")
    const data = await res.json()
    const items: { quantity: number }[] = data.items ?? []
    return items.reduce((sum, item) => sum + item.quantity, 0)
  } catch {
    // Fallback: read from localStorage
    const raw = localStorage.getItem("cart")
    if (!raw) return 0
    const cart: Record<string, number> = JSON.parse(raw)
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  }
}

export const useCartStore = createStore<CartSlice>()((set) => ({
  count: 0,
  setCount: (count: number) => set({ count }),
  fetchCount: async () => {
    set({ loading: true, error: null })
    try {
      const count = await getCartCount()
      set({ count, loading: false })
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch cart count",
      })
    }
  },
}))
