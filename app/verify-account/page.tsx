"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

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

export default function VerifyAccountPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure client-side rendering for animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get email from session on component mount
  useEffect(() => {
    const getSessionData = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.success && data.session?.email) {
          setEmail(data.session.email)
        } else {
          // No session found, redirect to signup
          router.push("/signup")
          return
        }
      } catch (error) {
        console.error("Error getting session:", error)
        router.push("/signup")
        return
      } finally {
        setSessionLoaded(true)
      }
    }

    getSessionData()
  }, [router])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }), // Only send OTP, email comes from session
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Account verified successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/login?verified=true")
        }, 2000)
      } else {
        setError(data.message || "Verification failed. Please try again.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No body needed - email comes from session
      })

      const data = await response.json()

      if (data.success) {
        setMessage("New verification code sent! Please check your email.")
        setCountdown(60) // 60 second cooldown
      } else {
        setError(data.message || "Failed to resend code. Please try again.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  // Show loading while session is being fetched
  if (!sessionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    )
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

          <Card className="border-gray-800 shadow-2xl bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl text-white">Verify Your Account</CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a 6-digit verification code to <span className="font-medium text-emerald-400">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* OTP Input */}
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setOtp(value)
                    }}
                    className="text-center text-lg tracking-widest font-mono bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-400 text-center">Enter the 6-digit code sent to your email</p>
                </div>

                {/* Messages */}
                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10 text-red-300">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {/* Verify Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Account"}
                </Button>
              </form>

              {/* Resend Section */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">Didn't receive the code?</p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isResending || countdown > 0}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                >
                  {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Need help?{" "}
                  <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                    Contact support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
