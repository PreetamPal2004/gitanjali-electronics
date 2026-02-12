import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean

  login: (
    email: string,
    password: string,
    localCart?: any[]
  ) => Promise<{ success: boolean; error?: string; cart?: any }>

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>

  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true })
      },

      login: async (email, password, localCart) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, localCart }),
          })

          const data = await response.json()

          if (!response.ok) {
            return { success: false, error: data.error || "Login failed" }
          }

          // Clear guest cart after successful login
          localStorage.removeItem("volt-cart")

          set({
            user: data.user,
            isAuthenticated: true,
          })

          return { success: true, cart: data.cart }
        } catch (error) {
          console.error("Login error:", error)
          return { success: false, error: "An error occurred" }
        }
      },

      register: async (name, email, password) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            return { success: false, error: data.error || "Registration failed" }
          }

          set({
            user: data.user,
            isAuthenticated: true,
          })

          return { success: true }
        } catch (error) {
          console.error("Registration error:", error)
          return { success: false, error: "An error occurred" }
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" })
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          // Clear guest cart completely
          localStorage.removeItem("volt-cart")

          set({
            user: null,
            isAuthenticated: false,
          })
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/me")
          const data = await response.json()

          if (response.ok) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
