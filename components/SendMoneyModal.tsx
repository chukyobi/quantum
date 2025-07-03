"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Send, AlertTriangle, CheckCircle, User } from "lucide-react"

interface SendMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number, recipient: string) => void
  userBalance: number
}

export default function SendMoneyModal({ isOpen, onClose, onSuccess, userBalance }: SendMoneyModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "processing" | "success">("form")
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    note: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const amount = Number.parseFloat(formData.amount)

    if (!formData.recipient.trim()) {
      setError("Please enter recipient email or wallet ID")
      return
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (amount > userBalance) {
      setError("Insufficient balance")
      return
    }

    setStep("confirm")
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setStep("processing")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep("success")
      setTimeout(() => {
        onSuccess(Number.parseFloat(formData.amount), formData.recipient)
        handleClose()
      }, 2000)
    } catch (error) {
      setError("Failed to send money. Please try again.")
      setStep("form")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ recipient: "", amount: "", note: "" })
    setError("")
    onClose()
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
            <Send className="h-5 w-5" />
            Send Money
          </DialogTitle>
          <DialogDescription>
            {step === "form" && "Send money to another Goldman user"}
            {step === "confirm" && "Confirm your transaction details"}
            {step === "processing" && "Processing your transaction"}
            {step === "success" && "Money sent successfully"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Email or Wallet ID"
                    value={formData.recipient}
                    onChange={(e) => setFormData((prev) => ({ ...prev, recipient: e.target.value }))}
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available balance:</span>
                  <span className="font-medium">{formatCurrency(userBalance)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  type="text"
                  placeholder="What's this for?"
                  value={formData.note}
                  onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
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
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{formData.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(Number.parseFloat(formData.amount))}</span>
                  </div>
                  {formData.note && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Note:</span>
                      <span className="font-medium">{formData.note}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-medium">Free</span>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please review the details carefully. This transaction cannot be reversed once confirmed.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Confirm & Send
                </Button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Processing Transaction</h3>
                <p className="text-muted-foreground">
                  Sending {formatCurrency(Number.parseFloat(formData.amount))} to {formData.recipient}
                </p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Money Sent Successfully!</h3>
                <p className="text-muted-foreground">
                  {formatCurrency(Number.parseFloat(formData.amount))} has been sent to {formData.recipient}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
