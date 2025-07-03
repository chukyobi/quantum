"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CreditCard,
  Wallet,
  Copy,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Clock,
  RefreshCw,
  DollarSign,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number, method: string) => void
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  type: "fiat" | "crypto"
  fees: string
  processingTime: string
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  network: string
  address: string
  minAmount: number
  confirmations: number
  icon: string
  usdRate?: number
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account",
    icon: (
      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
        PP
      </div>
    ),
    type: "fiat",
    fees: "2.9% + $0.30",
    processingTime: "Instant",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay with Visa, Mastercard, or American Express",
    icon: <CreditCard className="w-6 h-6 text-gray-600" />,
    type: "fiat",
    fees: "3.5%",
    processingTime: "Instant",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    description: "Send crypto from your external wallet",
    icon: <Wallet className="w-6 h-6 text-orange-500" />,
    type: "crypto",
    fees: "Network fees only",
    processingTime: "5-30 minutes",
  },
]

const cryptoOptions: CryptoOption[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    minAmount: 0.001,
    confirmations: 3,
    icon: "₿",
    usdRate: 43250.0,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    minAmount: 0.01,
    confirmations: 12,
    icon: "Ξ",
    usdRate: 2650.0,
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    network: "Ethereum (ERC-20)",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    minAmount: 10,
    confirmations: 12,
    icon: "₮",
    usdRate: 1.0,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    network: "Solana",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    minAmount: 0.1,
    confirmations: 1,
    icon: "◎",
    usdRate: 98.5,
  },
]

export default function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
  const [step, setStep] = useState<"method" | "amount" | "crypto-select" | "crypto-deposit" | "processing">("method")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedField, setCopiedField] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [cryptoRates, setCryptoRates] = useState<any>({})

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("method")
      setSelectedMethod(null)
      setSelectedCrypto(null)
      setAmount("")
      setError("")
      setTransactionId("")
      setIsMonitoring(false)
      loadCryptoRates()
    }
  }, [isOpen])

  // Load crypto rates
  const loadCryptoRates = async () => {
    try {
      const response = await fetch("/api/payments/crypto/get-rates")
      if (response.ok) {
        const data = await response.json()
        setCryptoRates(data.rates)
      }
    } catch (error) {
      console.error("Failed to load crypto rates:", error)
    }
  }

  // Monitor crypto transactions
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring && selectedCrypto && transactionId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch("/api/payments/crypto/check-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId,
              cryptoType: selectedCrypto.id,
              address: selectedCrypto.address,
            }),
          })

          const data = await response.json()

          if (data.success && data.transaction?.status === "confirmed") {
            setIsMonitoring(false)
            // Convert crypto amount to USD
            const usdAmount =
              data.transaction.amount * (cryptoRates[selectedCrypto.id]?.usd || selectedCrypto.usdRate || 1)
            onSuccess(usdAmount, `${selectedCrypto.symbol} Crypto`)
            onClose()
          }
        } catch (error) {
          console.error("Error checking transaction:", error)
        }
      }, 10000) // Check every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring, selectedCrypto, transactionId, onSuccess, onClose, cryptoRates])

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setError("")

    if (method.id === "crypto") {
      setStep("crypto-select")
    } else {
      setStep("amount")
    }
  }

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto)
    setStep("amount")
  }

  const handleAmountSubmit = () => {
    const numAmount = Number.parseFloat(amount)

    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (selectedMethod?.id === "crypto" && selectedCrypto) {
      if (numAmount < selectedCrypto.minAmount) {
        setError(`Minimum amount is ${selectedCrypto.minAmount} ${selectedCrypto.symbol}`)
        return
      }
      setStep("crypto-deposit")
    } else {
      handleFiatPayment()
    }
  }

  const handleFiatPayment = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/payments/fiat/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod?.id,
          amount: Number.parseFloat(amount),
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (selectedMethod?.id === "paypal") {
          // Redirect to PayPal
          window.open(data.paypalUrl, "_blank")
          setStep("processing")
        } else if (selectedMethod?.id === "card") {
          // Redirect to Stripe
          window.open(data.stripeUrl, "_blank")
          setStep("processing")
        }
      } else {
        setError(data.message || "Payment failed")
      }
    } catch (error) {
      setError("An error occurred while processing payment")
    } finally {
      setIsLoading(false)
    }
  }

  const startCryptoMonitoring = () => {
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setTransactionId(txId)
    setIsMonitoring(true)
    setStep("processing")
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(""), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const goBack = () => {
    if (step === "amount" && selectedMethod?.id === "crypto") {
      setStep("crypto-select")
    } else if (step === "crypto-select" || step === "amount") {
      setStep("method")
    } else if (step === "crypto-deposit") {
      setStep("amount")
    }
  }

  const getUsdEquivalent = (cryptoAmount: number, cryptoId: string) => {
    const rate = cryptoRates[cryptoId]?.usd || cryptoOptions.find((c) => c.id === cryptoId)?.usdRate || 1
    return (cryptoAmount * rate).toLocaleString("en-US", { style: "currency", currency: "USD" })
  }

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-sm text-muted-foreground">Select how you'd like to add funds to your wallet</p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
            onClick={() => handleMethodSelect(method)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0">{method.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                <div className="flex gap-4 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Fee: {method.fees}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {method.processingTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCryptoSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Select Cryptocurrency</h3>
          <p className="text-sm text-muted-foreground">Choose which crypto you want to send</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {cryptoOptions.map((crypto) => {
          const currentRate = cryptoRates[crypto.id]?.usd || crypto.usdRate
          const change24h = cryptoRates[crypto.id]?.change_24h || 0

          return (
            <Card
              key={crypto.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
              onClick={() => handleCryptoSelect(crypto)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  {crypto.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {crypto.name} ({crypto.symbol})
                    </h4>
                    <div className="text-right">
                      <p className="text-sm font-medium">${currentRate?.toLocaleString()}</p>
                      <p className={`text-xs ${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {change24h >= 0 ? "+" : ""}
                        {change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{crypto.network}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Min: {crypto.minAmount} {crypto.symbol}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {crypto.confirmations} confirmations
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderAmountInput = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Enter Amount</h3>
          <p className="text-sm text-muted-foreground">
            {selectedMethod?.id === "crypto" && selectedCrypto
              ? `Send ${selectedCrypto.symbol} to your wallet`
              : `Add funds via ${selectedMethod?.name}`}
          </p>
        </div>
      </div>

      {selectedMethod?.id === "crypto" && selectedCrypto && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Minimum amount: {selectedCrypto.minAmount} {selectedCrypto.symbol}
            {selectedCrypto && (
              <span className="block text-xs mt-1">
                ≈ {getUsdEquivalent(selectedCrypto.minAmount, selectedCrypto.id)}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount {selectedMethod?.id === "crypto" && selectedCrypto ? `(${selectedCrypto.symbol})` : "(USD)"}
        </Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={
              selectedMethod?.id === "crypto" && selectedCrypto
                ? `Enter ${selectedCrypto.symbol} amount`
                : "Enter USD amount"
            }
            className="text-lg pr-12"
          />
          {selectedMethod?.id !== "crypto" && (
            <DollarSign className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {selectedMethod?.id === "crypto" && selectedCrypto && amount && (
          <p className="text-sm text-muted-foreground">
            ≈ {getUsdEquivalent(Number.parseFloat(amount) || 0, selectedCrypto.id)}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleAmountSubmit} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : "Continue"}
      </Button>
    </div>
  )

  const renderCryptoDeposit = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Send {selectedCrypto?.symbol}</h3>
          <p className="text-sm text-muted-foreground">
            Send exactly {amount} {selectedCrypto?.symbol} to the address below
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg border">
          <QRCodeSVG value={selectedCrypto?.address || ""} size={200} />
        </div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-2">
        <Label>Wallet Address ({selectedCrypto?.network})</Label>
        <div className="flex items-center gap-2">
          <Input value={selectedCrypto?.address || ""} readOnly className="font-mono text-sm" />
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedCrypto?.address || "", "address")}>
            {copiedField === "address" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Amount to Send */}
      <div className="space-y-2">
        <Label>Amount to Send</Label>
        <div className="flex items-center gap-2">
          <Input value={`${amount} ${selectedCrypto?.symbol}`} readOnly className="font-mono text-lg font-bold" />
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(amount, "amount")}>
            {copiedField === "amount" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {selectedCrypto && (
          <p className="text-sm text-muted-foreground">
            ≈ {getUsdEquivalent(Number.parseFloat(amount) || 0, selectedCrypto.id)}
          </p>
        )}
      </div>

      {/* Important Notes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p>
              <strong>Important:</strong>
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                Send exactly {amount} {selectedCrypto?.symbol} to avoid delays
              </li>
              <li>
                Only send {selectedCrypto?.symbol} on {selectedCrypto?.network} network
              </li>
              <li>Requires {selectedCrypto?.confirmations} network confirmations</li>
              <li>Processing time: 5-30 minutes after confirmation</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Button onClick={startCryptoMonitoring} className="w-full">
        I've Sent the {selectedCrypto?.symbol}
      </Button>
    </div>
  )

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        {isMonitoring ? (
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        ) : (
          <Clock className="h-8 w-8 text-primary" />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">{isMonitoring ? "Monitoring Transaction" : "Processing Payment"}</h3>
        <p className="text-sm text-muted-foreground">
          {isMonitoring
            ? `Waiting for ${selectedCrypto?.symbol} transaction confirmation...`
            : "Please complete the payment in the opened window"}
        </p>
      </div>

      {isMonitoring && (
        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              We're monitoring the blockchain for your {selectedCrypto?.symbol} transaction. This usually takes 5-30
              minutes depending on network congestion.
            </AlertDescription>
          </Alert>

          <div className="text-xs text-muted-foreground">Transaction ID: {transactionId}</div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Close
        </Button>
        {!isMonitoring && (
          <Button onClick={() => window.location.reload()} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>Add money to your Goldman wallet using various payment methods</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "method" && renderMethodSelection()}
          {step === "crypto-select" && renderCryptoSelection()}
          {step === "amount" && renderAmountInput()}
          {step === "crypto-deposit" && renderCryptoDeposit()}
          {step === "processing" && renderProcessing()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
