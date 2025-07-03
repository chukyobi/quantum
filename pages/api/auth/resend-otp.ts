import type { NextApiRequest, NextApiResponse } from "next"
import { generateAndSendOtp } from "@/utils/generateAndSendOtp"
import { getSession } from "@/lib/session"

export default async function resendOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
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

    // Generate and send OTP using the utility function
    const result = await generateAndSendOtp(email)

    return res.status(200).json(result)
  } catch (error: any) {
    console.error("Error in resend OTP API:", error)

    // Handle specific error cases
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "No account found. Please start the signup process again.",
      })
    }

    if (error.message === "User is already verified") {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please sign in instead.",
      })
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    })
  }
}
