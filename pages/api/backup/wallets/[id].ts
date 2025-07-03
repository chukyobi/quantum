import type { NextApiRequest, NextApiResponse } from "next"

// Mock database - replace with your actual database
const wallets: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req
  const { id } = query

  switch (method) {
    case "GET":
      try {
        // Find wallet
        const wallet = wallets.find((w) => w.id === id && w.userId === "current-user")

        if (!wallet) {
          return res.status(404).json({ success: false, message: "Wallet not found" })
        }

        // Decrypt sensitive data for viewing
        const decryptedWallet = {
          ...wallet,
          privateKey: wallet.privateKey ? decrypt(wallet.privateKey) : undefined,
          seedPhrase: wallet.seedPhrase ? decrypt(wallet.seedPhrase) : undefined,
        }

        return res.status(200).json({
          success: true,
          wallet: decryptedWallet,
        })
      } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch wallet" })
      }

    case "DELETE":
      try {
        // Find and remove wallet
        const walletIndex = wallets.findIndex((w) => w.id === id && w.userId === "current-user")

        if (walletIndex === -1) {
          return res.status(404).json({ success: false, message: "Wallet not found" })
        }

        wallets.splice(walletIndex, 1)

        return res.status(200).json({
          success: true,
          message: "Wallet deleted successfully",
        })
      } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete wallet" })
      }

    case "PUT":
      try {
        const body = req.body

        // Find wallet
        const walletIndex = wallets.findIndex((w) => w.id === id && w.userId === "current-user")

        if (walletIndex === -1) {
          return res.status(404).json({ success: false, message: "Wallet not found" })
        }

        // Update wallet
        wallets[walletIndex] = {
          ...wallets[walletIndex],
          ...body,
          updatedAt: new Date().toISOString(),
        }

        return res.status(200).json({
          success: true,
          wallet: wallets[walletIndex],
        })
      } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update wallet" })
      }

    default:
      res.setHeader("Allow", ["GET", "DELETE", "PUT"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// Simple encryption/decryption functions (use proper encryption in production)
function encrypt(data: string): string {
  return Buffer.from(data).toString("base64")
}

function decrypt(encryptedData: string): string {
  return Buffer.from(encryptedData, "base64").toString()
}
