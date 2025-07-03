import type { NextApiRequest, NextApiResponse } from "next"

interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  createdAt: string
  updatedAt: string
  assignedAgent?: {
    id: string
    name: string
    email: string
  }
  messages: Array<{
    id: string
    type: "user" | "agent" | "system"
    content: string
    timestamp: string
    sender?: {
      name: string
      role: string
    }
  }>
}

// Mock database - in production, use a real database
const tickets: SupportTicket[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      return handleGetTickets(req, res)
    case "POST":
      return handleCreateTicket(req, res)
    case "PUT":
      return handleUpdateTicket(req, res)
    case "DELETE":
      return handleDeleteTicket(req, res)
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
      return res.status(405).json({ error: "Method not allowed" })
  }
}

async function handleGetTickets(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query

    let filteredTickets = tickets

    if (userId) {
      filteredTickets = filteredTickets.filter((ticket) => ticket.userId === userId)
    }

    if (status) {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === status)
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex)

    return res.status(200).json({
      success: true,
      tickets: paginatedTickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredTickets.length,
        totalPages: Math.ceil(filteredTickets.length / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return res.status(500).json({ error: "Failed to fetch tickets" })
  }
}

async function handleCreateTicket(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, subject, description, category, priority = "medium" } = req.body

    if (!userId || !subject || !description) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      userId,
      subject,
      description,
      status: "open",
      priority,
      category: category || "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          type: "user",
          content: description,
          timestamp: new Date().toISOString(),
        },
        {
          id: `msg_${Date.now() + 1}`,
          type: "system",
          content: "Your support ticket has been created. Our team will respond shortly.",
          timestamp: new Date().toISOString(),
        },
      ],
    }

    tickets.push(newTicket)

    return res.status(201).json({
      success: true,
      ticket: newTicket,
    })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return res.status(500).json({ error: "Failed to create ticket" })
  }
}

async function handleUpdateTicket(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ticketId } = req.query
    const updates = req.body

    const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId)

    if (ticketIndex === -1) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return res.status(200).json({
      success: true,
      ticket: tickets[ticketIndex],
    })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return res.status(500).json({ error: "Failed to update ticket" })
  }
}

async function handleDeleteTicket(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ticketId } = req.query

    const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId)

    if (ticketIndex === -1) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    tickets.splice(ticketIndex, 1)

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return res.status(500).json({ error: "Failed to delete ticket" })
  }
}
