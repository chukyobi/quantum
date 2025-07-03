"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send, Bot, User, Minimize2, Maximize2, Loader2, Headphones } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai" | "agent" | "system"
  content: string
  timestamp: Date
  sender?: {
    name: string
    avatar?: string
    role?: string
  }
}

interface SupportAgent {
  id: string
  name: string
  avatar?: string
  status: "online" | "busy" | "offline"
  role: string
  responseTime: string
}

export default function LiveSupportWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<SupportAgent | null>(null)
  const [supportMode, setSupportMode] = useState<"ai" | "human">("ai")
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Mock support agents
  const supportAgents: SupportAgent[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      role: "Senior Support Specialist",
      responseTime: "< 2 min",
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      role: "Technical Expert",
      responseTime: "< 5 min",
    },
    {
      id: "3",
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "busy",
      role: "Account Manager",
      responseTime: "< 10 min",
    },
  ]

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsConnected(true)

      // Auto-start AI conversation
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content:
          "👋 Hi there! I'm your AI assistant from FinanceX. I'm here to help you with any questions about your account, transactions, or our services. How can I assist you today?",
        timestamp: new Date(),
        sender: {
          name: "FinanceX AI",
          role: "AI Assistant",
        },
      }

      setTimeout(() => {
        setMessages([welcomeMessage])
        setHasNewMessage(true)
      }, 500)

      // Add some helpful quick suggestions after welcome
      setTimeout(() => {
        const suggestionsMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "system",
          content:
            "💡 Quick help options:\n• Check account balance\n• Recent transactions\n• Security settings\n• Contact human agent\n\nJust type your question or click on any topic!",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, suggestionsMessage])
      }, 2000)
    }
  }, [isOpen, messages.length])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Clear new message indicator when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setIsLoading(true)

    try {
      let response: Message

      if (supportMode === "ai") {
        response = await getAIResponse(inputMessage)
      } else {
        response = await getHumanResponse(inputMessage)
      }

      // Simulate typing delay
      setTimeout(() => {
        setMessages((prev) => [...prev, response])
        setIsTyping(false)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: "❌ Sorry, I'm having trouble connecting. Please try again or contact our support team directly.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  const getAIResponse = async (userMessage: string): Promise<Message> => {
    // Enhanced AI responses based on common queries
    const lowerMessage = userMessage.toLowerCase()

    let response = ""

    if (lowerMessage.includes("balance") || lowerMessage.includes("account")) {
      response =
        "💰 I can help you check your account balance! Your current balance is $12,450.67. Would you like to see recent transactions or need help with anything else?"
    } else if (lowerMessage.includes("transaction") || lowerMessage.includes("payment")) {
      response =
        "💳 I can see your recent transactions. Your last payment was $250.00 to Amazon on Dec 15th. Would you like me to show more details or help with a specific transaction?"
    } else if (lowerMessage.includes("security") || lowerMessage.includes("password")) {
      response =
        "🔒 Security is important! I can help you with password reset, two-factor authentication setup, or security settings. What specific security feature do you need help with?"
    } else if (lowerMessage.includes("human") || lowerMessage.includes("agent") || lowerMessage.includes("person")) {
      response =
        "👥 I'd be happy to connect you with one of our human agents! They're available 24/7 and can provide more personalized assistance. Would you like me to transfer you now?"
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      response =
        "👋 Hello! Great to chat with you! I'm here to help with any questions about your FinanceX account, transactions, or our services. What can I assist you with today?"
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      response =
        "🆘 I'm here to help! I can assist with:\n• Account information & balance\n• Transaction history & details\n• Security & password issues\n• General questions about our services\n• Connect you with human agents\n\nWhat do you need help with?"
    } else {
      // Generic helpful responses
      const responses = [
        "🤔 That's a great question! Let me help you with that. Could you provide a bit more detail so I can give you the most accurate information?",
        "✨ I understand what you're asking about. Based on your query, I recommend checking your account dashboard for the most up-to-date information. Need me to guide you there?",
        "💡 I'd be happy to help you with that! For the best assistance, could you tell me more about what specifically you're looking for?",
        "🎯 Thanks for reaching out! I can definitely help you with that. Let me provide you with the information you need...",
        "🚀 Great question! I have some helpful information for you. Would you also like me to connect you with a specialist for more detailed assistance?",
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response,
      timestamp: new Date(),
      sender: {
        name: "FinanceX AI",
        role: "AI Assistant",
      },
    }
  }

  const getHumanResponse = async (userMessage: string): Promise<Message> => {
    const agent = currentAgent || supportAgents[0]

    const responses = [
      "Thank you for contacting FinanceX support! I'm reviewing your question and will provide a detailed response in just a moment.",
      "Hi there! I'm here to help you with your inquiry. Let me look into this for you right away.",
      "Thanks for reaching out! I can see your question and I'm gathering the information you need. One moment please.",
      "Hello! I appreciate your patience. I'm checking your account details to provide you with the most accurate assistance.",
    ]

    return {
      id: Date.now().toString(),
      type: "agent",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      sender: {
        name: agent.name,
        avatar: agent.avatar,
        role: agent.role,
      },
    }
  }

  const switchToHumanSupport = () => {
    setSupportMode("human")
    const availableAgent = supportAgents.find((agent) => agent.status === "online") || supportAgents[0]
    setCurrentAgent(availableAgent)

    const transferMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: `🔄 You're now connected with ${availableAgent.name}, ${availableAgent.role}. Average response time: ${availableAgent.responseTime}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, transferMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    setTimeout(() => handleSendMessage(), 100)
  }

  // Floating widget when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 support-widget-bounce glow-on-hover"
          >
            <div className="flex flex-col items-center">
              <Headphones className="h-6 w-6 text-white mb-1" />
              <span className="text-xs text-white font-medium">Support</span>
            </div>
          </Button>

          {/* Online status indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full status-online flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* New message indicator */}
          {hasNewMessage && (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}

          {/* Floating tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Need help? Chat with our AI assistant!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 support-widget-enter">
      <Card
        className={`w-96 shadow-2xl border-0 bg-white ${isMinimized ? "h-16" : "h-[650px]"} transition-all duration-300 rounded-xl overflow-hidden`}
      >
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              {supportMode === "ai" ? (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
              ) : currentAgent ? (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentAgent.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentAgent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                  isConnected ? "status-online" : "status-offline"
                }`}
              ></div>
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {supportMode === "ai" ? "FinanceX AI Support" : currentAgent?.name || "Live Support"}
              </CardTitle>
              <p className="text-sm text-white/90">
                {isConnected
                  ? supportMode === "ai"
                    ? "Online 24/7 • Instant replies"
                    : currentAgent?.role
                  : "Connecting..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(650px-88px)]">
            {/* Support Mode Toggle */}
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Choose Support Type</span>
                <Badge variant={supportMode === "ai" ? "default" : "secondary"} className="text-xs">
                  {supportMode === "ai" ? "🤖 AI Assistant" : "👤 Human Agent"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={supportMode === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSupportMode("ai")}
                  className="flex-1 text-xs h-8"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  AI Chat (Instant)
                </Button>
                <Button
                  variant={supportMode === "human" ? "default" : "outline"}
                  size="sm"
                  onClick={switchToHumanSupport}
                  className="flex-1 text-xs h-8"
                >
                  <User className="h-3 w-3 mr-1" />
                  Human Agent
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} chat-message`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.type === "user"
                          ? "chat-bubble-user"
                          : message.type === "system"
                            ? "chat-bubble-system"
                            : "chat-bubble-ai"
                      } p-3 shadow-sm`}
                    >
                      {message.sender && message.type !== "user" && (
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === "ai" ? (
                            <Bot className="h-4 w-4 text-blue-600" />
                          ) : message.sender.avatar ? (
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {message.sender.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : null}
                          <span className="text-xs font-semibold text-gray-700">{message.sender.name}</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-ai p-3 chat-typing shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {supportMode === "ai" ? "AI is typing..." : `${currentAgent?.name} is typing...`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white hover:bg-blue-50"
                  onClick={() => handleQuickAction("Check my account balance")}
                >
                  💰 Balance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white hover:bg-blue-50"
                  onClick={() => handleQuickAction("Show recent transactions")}
                >
                  📊 Transactions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white hover:bg-blue-50"
                  onClick={() => handleQuickAction("Help with security settings")}
                >
                  🔒 Security
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white hover:bg-blue-50"
                  onClick={() => handleQuickAction("Connect me with a human agent")}
                >
                  👤 Human Help
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white border-gray-200 focus:border-blue-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                  {isConnected ? "Connected & Ready" : "Connecting..."}
                </div>
                <span>Press Enter to send</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
