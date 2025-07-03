// app/login/page.tsx
import { Suspense } from "react"
import dynamic from "next/dynamic"

const LoginForm = dynamic(() => import("./LoginForm"), { ssr: false })

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-8">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
