import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import sendVerificationEmail from "@/utils/sendVerificationEmail"
import { createUserWithWallet } from "@/lib/creatUser"
import { createSession } from "@/lib/session"

interface SignupRequestBody {
  email: string
  name: string
  password: string
}

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    const { email, name, password }: SignupRequestBody = req.body

    // Validate required fields
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Generate new 6-character OTP for existing unverified user
        const otp = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.user.update({
          where: { email: email.toLowerCase() },
          data: { otp, otpExpires },
        })

        const emailSent = await sendVerificationEmail(email, otp)
        if (!emailSent) {
          return res.status(500).json({
            success: false,
            message: "Error sending verification email",
          })
        }

        // Create session for verification - pass res parameter
        await createSession(email.toLowerCase(), res)

        return res.status(200).json({
          success: true,
          message: "Verification email resent. Please check your inbox and verify your account.",
        })
      }

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      })
    }

    // Hash password and generate 6-character OTP
    const hashedPassword = await bcrypt.hash(password, 12)
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000)

    console.log("🚀 Starting user creation process...")

    // Create user, wallet, and backup wallets
    let createdUser
    try {
      const result = await createUserWithWallet({
        email: email.toLowerCase(),
        name: name.trim(),
        hashedPassword,
        isOAuthUser: false,
      })

      if (!result || !result.user) {
        throw new Error("Failed to create user with wallet.")
      }

      createdUser = result.user
      console.log("✅ User created successfully:", createdUser.email)
    } catch (createError: any) {
      console.error("❌ Error creating user:", createError)
      return res.status(500).json({
        success: false,
        message: `Failed to create user: ${createError.message}`,
      })
    }

    // Update user with OTP details
    try {
      await prisma.user.update({
        where: { email: createdUser.email },
        data: {
          otp,
          otpExpires,
          isVerified: false,
        },
      })
      console.log("✅ OTP updated successfully")
    } catch (otpError: any) {
      console.error("❌ Error updating OTP:", otpError)
      // Clean up created user if OTP update fails
      try {
        await prisma.user.delete({ where: { email: createdUser.email } })
      } catch (cleanupError) {
        console.error("❌ Error cleaning up user:", cleanupError)
      }
      return res.status(500).json({
        success: false,
        message: "Failed to set up verification code",
      })
    }

    // Send verification email
    try {
      const emailSent = await sendVerificationEmail(email, otp)
      if (!emailSent) {
        throw new Error("Email sending failed")
      }
      console.log("✅ Verification email sent successfully")
    } catch (emailError: any) {
      console.error("❌ Error sending email:", emailError)
      // Clean up created user if email fails
      try {
        await prisma.user.delete({ where: { email: email.toLowerCase() } })
      } catch (cleanupError) {
        console.error("❌ Error cleaning up user:", cleanupError)
      }
      return res.status(500).json({
        success: false,
        message: "Error sending verification email. Please try again.",
      })
    }

    // Create session for verification - pass res parameter
    try {
      await createSession(email.toLowerCase(), res)
      console.log("✅ Session created successfully")
    } catch (sessionError: any) {
      console.error("❌ Error creating session:", sessionError)
      // Don't fail the entire process for session creation
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Please check your email for a 6-digit verification code.",
    })
  } catch (error: any) {
    console.error("❌ Unexpected error in signup:", error)

    // Log detailed error information
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    })

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      })
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    })
  }
}
