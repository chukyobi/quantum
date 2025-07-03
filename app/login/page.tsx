"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "./LoginForm"
import { Suspense } from "react"

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white text-center p-8">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
