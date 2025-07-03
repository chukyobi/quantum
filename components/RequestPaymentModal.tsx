"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Download, AlertTriangle, CheckCircle, User, Share2, Copy } from "lucide-react"

interface RequestPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number, from: string) => void
}

export default function RequestPaymentModal({ isOpen, onClose, onSuccess }: RequestPaymentModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form")
  const [formData, setFormData] = useState({
    from: "",
    amount: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [paymentLink, setPaymentLink] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const amount = Number.parseFloat(formData.amount)

    if (!formData.from.trim()) {
      setError("Please enter the payer's email")
      return
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!formData.description.trim()) {
      setError("Please enter a description for the payment request")
      return
    }

    setStep("confirm")
  }

  const handleConfirm = async () => {
    try {
      // Generate payment link
      const link = `https://goldman.app/pay/${Math.random().toString(36).substr(2, 9)}`
      setPaymentLink(link)
      setStep("success")

      // Simulate sending request
      setTimeout(() => {
        onSuccess(Number.parseFloat(formData.amount), formData.from)
      }, 1000)
    } catch (error) {
      setError("Failed to create payment request. Please try again.")
    }
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ from: "", amount: "", description: "" })
    setError("")
    setPaymentLink("")
    setCopied(false)
    onClose()
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const sharePaymentLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Payment Request",
        text: `Payment request for $${formData.amount} - ${formData.description}`,
        url: paymentLink,
      })
    } else {
      copyToClipboard()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Request Payment
          </DialogTitle>
          <DialogDescription>
            {step === "form" && "Create a payment request to send to someone"}
            {step === "confirm" && "Review your payment request details"}
            {step === "success" && "Payment request created successfully"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from">Request From</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="from"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.from}
                    onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="What's this payment for?"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Confirmation Step */}
          {step === "confirm" && (
            <div className="space-y-4">
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">{formData.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(Number.parseFloat(formData.amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">For:</span>
                    <span className="font-medium">{formData.description}</span>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  A payment request will be sent to {formData.from} with a secure payment link.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Create Request
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="space-y-4">
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600">Payment Request Created!</h3>
                  <p className="text-muted-foreground">
                    Request for {formatCurrency(Number.parseFloat(formData.amount))} has been created
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium">Payment Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={paymentLink} readOnly className="text-xs" />
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={sharePaymentLink} className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
