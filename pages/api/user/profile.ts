import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    // Get session
    const sessionData = await getSession(req)
    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: sessionData.email },
      include: {
        wallets: true,
        backupWallets: {
          select: {
            id: true,
            name: true,
            logo: true,
            balance: true,
            currency: true,
            // Exclude sensitive data
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Return user data (excluding sensitive information)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        wallets: user.wallets,
        backupWallets: user.backupWallets,
      },
    })
  } catch (error: any) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    })
  }
}
