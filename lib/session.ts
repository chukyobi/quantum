import type { NextApiRequest, NextApiResponse } from "next"
import { SignJWT, jwtVerify, type JWTPayload } from "jose"

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-this"
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionData extends JWTPayload {
  email: string
  isVerified: boolean
  userId?: number
  expiresAt: string // Changed to string for JWT compatibility
  [key: string]: any // Index signature required by JWTPayload
}

// Create session for Pages Router
export async function createSession(email: string, res: NextApiResponse) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const sessionData: SessionData = {
    email,
    isVerified: false,
    expiresAt: expiresAt.toISOString(), // Convert to string
  }

  const session = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)

  // Set cookie using NextApiResponse
  res.setHeader(
    "Set-Cookie",
    `session=${session}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
  )

  return session
}

// Get session for Pages Router
export async function getSession(req: NextApiRequest): Promise<SessionData | null> {
  try {
    const sessionCookie = req.cookies.session

    if (!sessionCookie) {
      return null
    }

    const { payload } = await jwtVerify(sessionCookie, encodedKey)
    return payload as SessionData
  } catch (error) {
    console.error("Session verification failed:", error)
    return null
  }
}

// Update session for Pages Router
export async function updateSession(updates: Partial<SessionData>, req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req)
  if (!session) return null

  const updatedSession = { ...session, ...updates }
  const expiresAt = new Date(updatedSession.expiresAt)

  const newToken = await new SignJWT(updatedSession)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)

  res.setHeader(
    "Set-Cookie",
    `session=${newToken}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
  )

  return updatedSession
}

// Delete session for Pages Router
export async function deleteSession(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    `session=; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=0`,
  )
}
