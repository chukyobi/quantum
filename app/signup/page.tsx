"use client"

import { Suspense } from "react"
import SignupForm from "./SignupForm"

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-8">Loading signup...</div>}>
      <SignupForm />
    </Suspense>
  )
}
