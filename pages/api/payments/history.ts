import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { page = 1, limit = 10, type, status } = req.query

    // Mock payment history - in production, fetch from database
    const mockTransactions = [
      {
        id: "tx_001",
        type: "deposit",
        method: "PayPal",
        amount: 500.0,
        currency: "USD",
        status: "completed",
        createdAt: "2024-01-15T10:30:00Z",
        completedAt: "2024-01-15T10:30:15Z",
        txHash: null,
      },
      {
        id: "tx_002",
        type: "deposit",
        method: "BTC Crypto",
        amount: 0.01,
        currency: "BTC",
        usdValue: 432.5,
        status: "completed",
        createdAt: "2024-01-14T15:20:00Z",
        completedAt: "2024-01-14T15:45:00Z",
        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        confirmations: 6,
      },
      {
        id: "tx_003",
        type: "deposit",
        method: "Credit Card",
        amount: 250.0,
        currency: "USD",
        status: "completed",
        createdAt: "2024-01-13T09:15:00Z",
        completedAt: "2024-01-13T09:15:05Z",
        txHash: null,
      },
      {
        id: "tx_004",
        type: "deposit",
        method: "ETH Crypto",
        amount: 1.5,
        currency: "ETH",
        usdValue: 3975.0,
        status: "pending",
        createdAt: "2024-01-12T14:00:00Z",
        completedAt: null,
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        confirmations: 8,
      },
    ]

    // Filter transactions
    let filteredTransactions = mockTransactions

    if (type) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.type === type)
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.status === status)
    }

    // Pagination
    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    return res.status(200).json({
      success: true,
      transactions: paginatedTransactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limitNum),
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch payment history" })
  }
}
