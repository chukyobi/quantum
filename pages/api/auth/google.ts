import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleOAuth } from "@/lib/google-oauth"

export default async function googleAuth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const googleOAuth = new GoogleOAuth()

    // Generate a state parameter for security (optional but recommended)
    const state = Math.random().toString(36).substring(2, 15)

    // Store state in session/cookie for verification (optional)
    res.setHeader(
      "Set-Cookie",
      `oauth_state=${state}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=600`,
    )

    const authUrl = googleOAuth.getAuthUrl(state)

    return res.redirect(authUrl)
  } catch (error) {
    console.error("Google OAuth initiation error:", error)
    return res.status(500).json({ success: false, message: "Failed to initiate Google OAuth" })
  }
}
