"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { useSearchParamsSafe } from "@/hooks/useSearchParamsSafe"

// Pre-defined positions and animations to avoid hydration mismatch
const floatingDots = [
  { left: 15, top: 20, animation: "float-0", duration: 4, delay: 0 },
  { left: 85, top: 15, animation: "float-1", duration: 5, delay: 0.5 },
  { left: 25, top: 80, animation: "float-2", duration: 3.5, delay: 1 },
  { left: 70, top: 75, animation: "float-0", duration: 4.5, delay: 1.5 },
  { left: 45, top: 25, animation: "float-1", duration: 3.8, delay: 0.8 },
  { left: 90, top: 60, animation: "float-2", duration: 4.2, delay: 0.3 },
  { left: 10, top: 50, animation: "float-0", duration: 5.2, delay: 1.2 },
  { left: 60, top: 10, animation: "float-1", duration: 3.2, delay: 0.7 },
  { left: 35, top: 90, animation: "float-2", duration: 4.8, delay: 0.2 },
  { left: 80, top: 40, animation: "float-0", duration: 3.6, delay: 1.8 },
  { left: 20, top: 65, animation: "float-1", duration: 4.4, delay: 0.9 },
  { left: 75, top: 30, animation: "float-2", duration: 5.5, delay: 0.4 },
  { left: 50, top: 85, animation: "float-0", duration: 3.9, delay: 1.3 },
  { left: 95, top: 25, animation: "float-1", duration: 4.7, delay: 0.6 },
  { left: 30, top: 45, animation: "float-2", duration: 3.3, delay: 1.7 },
  { left: 65, top: 70, animation: "float-0", duration: 5.8, delay: 0.1 },
  { left: 5, top: 35, animation: "float-1", duration: 4.1, delay: 1.4 },
  { left: 85, top: 80, animation: "float-2", duration: 3.7, delay: 0.8 },
  { left: 40, top: 15, animation: "float-0", duration: 4.9, delay: 1.1 },
  { left: 75, top: 55, animation: "float-1", duration: 3.4, delay: 1.6 },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParamsSafe()
  const { signInWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  const [successMessage, setSuccessMessage] = useState("")

  // Ensure client-side rendering for animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check for URL parameters
  useEffect(() => {
    const verified = searchParams.get("verified")
    const error = searchParams.get("error")

    if (verified === "true") {
      setSuccessMessage("Account verified successfully! You can now sign in.")
    }

    if (error) {
      const errorMessages = {
        oauth_error: "Google sign-in was cancelled or failed",
        missing_code: "Google sign-in failed - missing authorization code",
        invalid_state: "Google sign-in failed - security check failed",
        oauth_callback_failed: "Google sign-in failed - please try again",
      }

      setErrors((prev) => ({
        ...prev,
        general: errorMessages[error as keyof typeof errorMessages] || "Sign-in failed",
      }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear specific field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors((prev) => ({ ...prev, general: "" }))
    setSuccessMessage("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        if (data.requiresVerification) {
          // Redirect to verification page if account needs verification
          router.push("/verify-account")
        } else if (data.isOAuthAccount) {
          setErrors((prev) => ({
            ...prev,
            general: data.message + " Use the Google sign-in button below.",
          }))
        } else {
          setErrors((prev) => ({ ...prev, general: data.message || "Login failed. Please try again." }))
        }
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: "An unexpected error occurred. Please try again." }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignin = async () => {
    setErrors((prev) => ({ ...prev, general: "" }))
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        {/* Primary Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full animate-grid-move"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Secondary Grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full animate-grid-move-reverse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Floating Dots - Only render on client */}
        {isMounted && (
          <div className="absolute inset-0">
            {floatingDots.map((dot, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
                style={{
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  animation: `${dot.animation} ${dot.duration}s ease-in-out infinite`,
                  animationDelay: `${dot.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-purple-500/5 rounded-full blur-3xl" />

        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q400,50 800,100 T1600,100"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,300 Q600,250 1200,300 T2400,300"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Back to signup link */}
          <Link
            href="/signup"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to signup
          </Link>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                Goldman
              </span>
            </h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Form Card */}
          <Card className="border-gray-800 shadow-2xl bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-white">Sign In</CardTitle>
              <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <Alert className="border-emerald-200 bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Google Signin Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
                onClick={handleGoogleSignin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* General Error */}
                {(errors.general || googleError) && (
                  <Alert className="border-red-500/20 bg-red-500/10 text-red-300">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription>{errors.general || googleError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Signup Link */}
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
                  Create account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
