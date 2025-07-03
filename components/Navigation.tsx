"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * A minimal, responsive navigation bar that blurs the background
 * and sticks to the top of the viewport.
 */
export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-900/60 border-b border-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500"
        >
          GoldmanX
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li>
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
          </li>
          <li>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How&nbsp;It&nbsp;Works
            </Link>
          </li>
          <li>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </Link>
          </li>
          <li>
            <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
          </li>
        </ul>

        {/* CTA button */}
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-6 py-3 text-sm font-medium"
          onClick={() => (window.location.href = "/login")}
        >
          Launch&nbsp;App
        </Button>
      </nav>
    </header>
  )
}
