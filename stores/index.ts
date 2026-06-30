"use client"

import { create as zustandCreate } from "zustand"
import { devtools } from "zustand/middleware"

/** Shape added by the base store to every derived store. */
export interface BaseState {
  /** Whether an async operation is in flight. */
  loading: boolean
  /** The most recent error message, if any. */
  error: string | null
}

const defaultBase: BaseState = {
  loading: false,
  error: null,
}

/**
 * Create a Zustand store pre-wired with devtools middleware and
 * {@link BaseState} fields (`loading` / `error`) plus a `reset` action.
 *
 * @example
 * ```ts
 * interface CartSlice {
 *   count: number
 *   setCount: (c: number) => void
 *   fetchCount: () => Promise<void>
 * }
 *
 * export const useCartStore = createStore<CartSlice>()((set) => ({
 *   count: 0,
 *   setCount: (count) => set({ count }),
 *   fetchCount: async () => { ... },
 * }))
 * ```
 */
export function createStore<T extends object>() {
  return (
    initializer: (
      set: (partial: Partial<T & BaseState & { reset: () => void }>) => void,
      get: () => T & BaseState & { reset: () => void },
      api: any,
    ) => T,
  ) => {
    return zustandCreate<T & BaseState & { reset: () => void }>()(
      devtools(
        (set, get, api) => ({
          ...defaultBase,
          ...initializer(set, get, api),
          reset: () => set({ ...defaultBase } as T & BaseState & { reset: () => void }),
        }),
        { name: "TechGadgetStore" },
      ),
    )
  }
}
