import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import LiveSupportWidget from "@/components/LiveSupportWidget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goldman Quantum - Secure your financial future",
  description: "Advanced financial services with AI-powered support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <LiveSupportWidget />
      </body>
    </html>
  )
}
