import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Mock crypto rates - in production, fetch from CoinGecko, CoinMarketCap, etc.
    const rates = {
      btc: {
        usd: 43250.0,
        symbol: "BTC",
        name: "Bitcoin",
        change_24h: 2.5,
      },
      eth: {
        usd: 2650.0,
        symbol: "ETH",
        name: "Ethereum",
        change_24h: 1.8,
      },
      usdt: {
        usd: 1.0,
        symbol: "USDT",
        name: "Tether",
        change_24h: 0.1,
      },
      sol: {
        usd: 98.5,
        symbol: "SOL",
        name: "Solana",
        change_24h: 4.2,
      },
    }

    return res.status(200).json({
      success: true,
      rates,
      timestamp: Date.now(),
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch crypto rates" })
  }
}
