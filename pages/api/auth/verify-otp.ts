import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getSession, updateSession } from "@/lib/session"

interface VerifyOtpRequestBody {
  otp: string
}

export default async function verifyOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    const { otp }: VerifyOtpRequestBody = req.body

    // Get email from session
    const sessionData = await getSession(req)
    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: "No session found. Please start the signup process again.",
      })
    }

    const email = sessionData.email

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please start the signup process again.",
      })
    }

    // Validate OTP
    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit code",
      })
    }

    // Find user by email from session
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified. Please sign in.",
      })
    }

    // Check if OTP exists and hasn't expired
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      })
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      })
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please try again.",
      })
    }

    // Update user as verified and clear OTP
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    })

    // Update session to mark as verified
    await updateSession({ isVerified: true }, req, res)

    console.log(`✅ User verified successfully: ${email}`)

    return res.status(200).json({
      success: true,
      message: "Account verified successfully! You can now sign in.",
    })
  } catch (error: any) {
    console.error("Error in verify OTP API:", error)

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    })
  }
}
