"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { X } from "lucide-react"

interface AuthDialogProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: "login" | "signup"
}

export function AuthDialog({ isOpen, onClose, defaultTab = "login" }: AuthDialogProps) {
    const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab)

    if (!isOpen) return null

    function handleSuccess() {
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-xl bg-card p-8 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-foreground">
                    {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </h2>

                <div className="mb-6 flex gap-2 rounded-lg bg-muted p-1">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "login"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "signup"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {activeTab === "login" ? (
                    <LoginForm onSuccess={handleSuccess} />
                ) : (
                    <SignupForm onSuccess={handleSuccess} />
                )}
            </div>
        </div>
    )
}
