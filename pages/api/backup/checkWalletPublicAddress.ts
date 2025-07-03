import type { NextApiRequest, NextApiResponse } from "next"

// Mock database - replace with your actual database
const wallets: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  try {
    const { userId, walletId } = query

    if (!userId || !walletId) {
      return res.status(400).json({ success: false, message: "Missing userId or walletId" })
    }

    // Find wallet by ID and user
    const wallet = wallets.find((w) => w.id === walletId && w.userId === userId)

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" })
    }

    // Return public address if exists
    return res.status(200).json({
      success: true,
      publicAddress: wallet.publicAddress || null,
      hasBackup: !!wallet.publicAddress,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to check wallet" })
  }
}
