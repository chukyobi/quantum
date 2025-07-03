"use client"

import { useState } from "react"

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Redirect to our Google OAuth endpoint
      window.location.href = "/api/auth/google"
    } catch (err) {
      setError("Failed to initiate Google sign-in")
      setIsLoading(false)
    }
  }

  return {
    signInWithGoogle,
    isLoading,
    error,
  }
}
