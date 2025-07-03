import type { NextApiRequest, NextApiResponse } from "next"
import { jwtVerify, type JWTPayload } from "jose"

interface SessionPayload extends JWTPayload {
  email: string
  isVerified: boolean
  expiresAt: string
  [key: string]: any
}

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-this"
const encodedKey = new TextEncoder().encode(secretKey)

export default async function session(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    const sessionCookie = req.cookies.session

    if (!sessionCookie) {
      return res.status(200).json({
        success: false,
        message: "No session found",
        session: null,
      })
    }

    const { payload } = await jwtVerify(sessionCookie, encodedKey)
    const sessionData = payload as SessionPayload

    return res.status(200).json({
      success: true,
      session: sessionData,
    })
  } catch (error) {
    console.error("Session verification failed:", error)
    return res.status(200).json({
      success: false,
      message: "Invalid session",
      session: null,
    })
  }
}
