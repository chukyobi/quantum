import type { NextApiRequest, NextApiResponse } from "next"

// Mock transactions database
const transactions: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const transaction = transactions.find((tx) => tx.id === id)

      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" })
      }

      return res.status(200).json({
        success: true,
        transaction,
      })
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch transaction" })
    }
  }

  if (req.method === "PUT") {
    try {
      const { status, amount, txHash } = req.body
      const transactionIndex = transactions.findIndex((tx) => tx.id === id)

      if (transactionIndex === -1) {
        return res.status(404).json({ success: false, message: "Transaction not found" })
      }

      // Update transaction
      transactions[transactionIndex] = {
        ...transactions[transactionIndex],
        status,
        amount,
        txHash,
        updatedAt: Date.now(),
      }

      return res.status(200).json({
        success: true,
        transaction: transactions[transactionIndex],
      })
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update transaction" })
    }
  }

  res.setHeader("Allow", ["GET", "PUT"])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
