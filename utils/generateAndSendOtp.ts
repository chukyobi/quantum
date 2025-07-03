import prisma from "@/lib/prisma"
import sendVerificationEmail from "@/utils/sendVerificationEmail"
import crypto from "crypto"

export async function generateAndSendOtp(email: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format")
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Check if user is already verified
    if (user.isVerified) {
      throw new Error("User is already verified")
    }

    // Generate a new 6-digit OTP (matching your signup flow)
    const otp = crypto.randomInt(100000, 999999).toString() // 6-digit OTP
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes (matching signup)

    // Update the OTP and expiration time in the database
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        otp,
        otpExpires,
        isVerified: false, // Ensure the user is not verified until OTP is verified
      },
    })

    // Send the OTP via email
    const emailSent = await sendVerificationEmail(email, otp)

    if (!emailSent) {
      throw new Error("Error sending verification email")
    }

    console.log(`✅ OTP resent successfully to: ${email}`)
    return {
      success: true,
      message: "6-digit verification code sent successfully. Please check your email.",
    }
  } catch (error: any) {
    console.error("❌ Error in generateAndSendOtp:", error)
    throw new Error(error.message || "Failed to generate and send OTP")
  }
}
