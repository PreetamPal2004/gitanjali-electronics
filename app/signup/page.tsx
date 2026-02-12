import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { Zap } from "lucide-react"

export const metadata = {
    title: "Sign Up - Volt Electronics",
    description: "Create your Volt Electronics account",
}

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <Zap className="h-8 w-8 text-accent" strokeWidth={2.5} />
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                            VOLT
                        </span>
                    </Link>
                    <h1 className="mt-6 font-serif text-3xl tracking-tight text-foreground">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join Volt Electronics for a premium shopping experience
                    </p>
                </div>

                <div className="mt-8 rounded-xl border border-border bg-card p-8 shadow-lg">
                    <SignupForm />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-foreground hover:text-accent transition-colors"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
