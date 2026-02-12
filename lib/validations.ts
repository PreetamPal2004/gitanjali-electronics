import { z } from "zod"

// Auth validation schemas
export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

// Cart validation schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    priceAtTime: z.number().min(0, "Price cannot be negative"),
})

export const updateCartSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type UpdateCartInput = z.infer<typeof updateCartSchema>
