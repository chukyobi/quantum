import type { NextApiRequest, NextApiResponse } from "next"

// Mock database - replace with your actual database
const wallets: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req

  if (method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  try {
    const { userId } = query
    const { publicAddress, walletName, seedPhrase, privateKey, qrCodeData } = req.body

    if (!userId || !publicAddress) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    // Create or update wallet
    const existingWalletIndex = wallets.findIndex((w) => w.publicAddress === publicAddress && w.userId === userId)

    const walletData = {
      id: existingWalletIndex >= 0 ? wallets[existingWalletIndex].id : Date.now().toString(),
      userId,
      name: walletName || "Connected Wallet",
      type: "metamask", // Default type
      publicAddress,
      privateKey: privateKey ? encrypt(privateKey) : undefined,
      seedPhrase: seedPhrase ? encrypt(seedPhrase) : undefined,
      qrCodeData: qrCodeData || undefined,
      balance: 0,
      currency: "ETH",
      createdAt: existingWalletIndex >= 0 ? wallets[existingWalletIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEncrypted: !!(privateKey || seedPhrase),
    }

    if (existingWalletIndex >= 0) {
      wallets[existingWalletIndex] = walletData
    } else {
      wallets.push(walletData)
    }

    return res.status(200).json({
      success: true,
      message: "Wallet data stored successfully",
      wallet: walletData,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to store wallet data" })
  }
}

// Simple encryption function (use proper encryption in production)
function encrypt(data: string): string {
  return Buffer.from(data).toString("base64")
}
