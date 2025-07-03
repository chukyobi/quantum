import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { createSession } from "@/lib/session"

interface LoginRequestBody {
  email: string
  password: string
}

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    const { email, password }: LoginRequestBody = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        wallets: true,
        backupWallets: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address before signing in. Check your inbox for the verification code.",
        requiresVerification: true,
      })
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account was created with Google. Please sign in with Google instead.",
        isOAuthAccount: true,
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Create session with user data
    await createSession(user.email, res)

    console.log(`✅ User logged in successfully: ${user.email}`)

    // Return user data (excluding sensitive information)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        wallets: user.wallets,
        backupWallets: user.backupWallets.map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          logo: wallet.logo,
          balance: wallet.balance,
          currency: wallet.currency,
          // Exclude sensitive data like privateKey, seedPhrase
        })),
      },
    })
  } catch (error: any) {
    console.error("❌ Error in login:", error)

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    })
  }
}
