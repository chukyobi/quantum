import type { NextApiRequest, NextApiResponse } from "next"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { message, context, supportMode } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    // AI-powered support response
    if (supportMode === "ai") {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: `You are a helpful customer support AI assistant for FinanceX, a digital finance platform. 
        You should be professional, friendly, and knowledgeable about:
        - Account management and settings
        - Payment processing and transactions
        - Security and privacy features
        - Platform navigation and features
        - Troubleshooting common issues
        
        If you cannot help with a specific issue, offer to connect the user with a human agent.
        Keep responses concise but helpful.`,
        prompt: message,
        maxTokens: 200,
      })

      return res.status(200).json({
        success: true,
        response: text,
        type: "ai",
        timestamp: new Date().toISOString(),
      })
    }

    // Human agent simulation (in real implementation, this would route to human agents)
    const humanResponses = [
      "Thank you for contacting FinanceX support. I'm reviewing your request and will provide assistance shortly.",
      "I understand your concern. Let me look into this for you right away.",
      "That's a great question! I'll need to check a few things on your account to give you the most accurate information.",
      "I'm here to help you resolve this issue. Can you provide me with a bit more detail about what you're experiencing?",
      "I see what's happening here. Let me walk you through the solution step by step.",
    ]

    const randomResponse = humanResponses[Math.floor(Math.random() * humanResponses.length)]

    return res.status(200).json({
      success: true,
      response: randomResponse,
      type: "human",
      agent: {
        name: "Sarah Johnson",
        role: "Senior Support Specialist",
        id: "agent_001",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Support chat error:", error)
    return res.status(500).json({
      error: "Failed to process support request",
      message: "Our support system is temporarily unavailable. Please try again in a few moments.",
    })
  }
}
