// pages/api/support/websocket.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import { Server as NetServer } from "http"

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: SocketIOServer
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const resWithSocket = res as NextApiResponseWithSocket

  if (resWithSocket.socket.server.io) {
    console.log("Socket is already running")
    res.end()
    return
  }

  console.log("Socket is initializing")
  const io = new SocketIOServer(resWithSocket.socket.server, {
    path: "/api/support/websocket",
    addTrailingSlash: false,
  })

  resWithSocket.socket.server.io = io

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("join-support", (data) => {
      const { userId, supportType } = data
      const roomId = `support_${userId}`
      socket.join(roomId)

      socket.emit("support-connected", {
        roomId,
        supportType,
        timestamp: new Date().toISOString(),
      })

      console.log(`User ${userId} joined support room: ${roomId}`)
    })

    socket.on("support-message", async (data) => {
      const { roomId, message, userId, supportType } = data

      try {
        io.to(roomId).emit("message-received", {
          id: Date.now().toString(),
          type: "user",
          content: message,
          timestamp: new Date().toISOString(),
          userId,
        })

        setTimeout(() => {
          const aiResponses = [
            "I understand your question. Let me help you with that.",
            "That's a great point. Here's what I recommend...",
            "I can definitely assist you with this issue.",
            "Let me check that information for you right away.",
          ]
          const response =
            supportType === "human"
              ? "Thank you for your message. A human agent will respond shortly."
              : aiResponses[Math.floor(Math.random() * aiResponses.length)]

          io.to(roomId).emit("message-received", {
            id: Date.now().toString(),
            type: supportType === "human" ? "agent" : "ai",
            content: response,
            timestamp: new Date().toISOString(),
            sender: {
              name: supportType === "human" ? "Sarah Johnson" : "AI Assistant",
              role: supportType === "human" ? "Support Specialist" : "Virtual Assistant",
            },
          })
        }, 1500)
      } catch (error) {
        console.error("Error handling support message:", error)
        socket.emit("error", { message: "Failed to process message" })
      }
    })

    socket.on("typing-start", (data) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: data.userId,
        isTyping: true,
      })
    })

    socket.on("typing-stop", (data) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: data.userId,
        isTyping: false,
      })
    })

    socket.on("agent-status", (data) => {
      const { roomId, status } = data
      io.to(roomId).emit("agent-status-update", {
        status,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  res.end()
}

export default SocketHandler
