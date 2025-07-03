"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Shield, Plus, Eye, EyeOff, Copy, CheckCircle, AlertTriangle, Trash2, Lock, Unlock } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

// Add MetaMask type declaration
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}

interface BackupWallet {
  id: string
  name: string
  type: "metamask" | "binance" | "trust_wallet"
  publicAddress: string
  privateKey?: string
  seedPhrase?: string
  balance?: number
  currency?: string
  createdAt: string
  isEncrypted: boolean
}

const walletTypes = [
  {
    id: "metamask",
    name: "MetaMask",
    logo: "/wallet-logos/metamask.svg",
    description: "Connect your MetaMask wallet",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "binance",
    name: "Binance Wallet",
    logo: "/wallet-logos/binance.svg",
    description: "Connect your Binance Smart Chain wallet",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "trust_wallet",
    name: "Trust Wallet",
    logo: "/wallet-logos/trust.svg",
    description: "Connect your Trust Wallet",
    color: "from-blue-500 to-blue-600",
  },
]

export default function WalletBackupPage() {
  const [wallets, setWallets] = useState<BackupWallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<BackupWallet | null>(null)
  const [selectedWalletType, setSelectedWalletType] = useState("")
  const [connectionStep, setConnectionStep] = useState<"select" | "connect" | "manual" | "success">("select")
  const [showPrivateData, setShowPrivateData] = useState<{ [key: string]: boolean }>({})
  const [copiedField, setCopiedField] = useState("")

  // Form data for manual wallet entry
  const [walletForm, setWalletForm] = useState({
    name: "",
    publicAddress: "",
    privateKey: "",
    seedPhrase: "",
    balance: "",
    currency: "USD",
  })

  // Load wallets on component mount
  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/backup/wallets")
      if (response.ok) {
        const data = await response.json()
        setWallets(data.wallets || [])
      } else {
        setError("Failed to load backup wallets")
      }
    } catch (error) {
      setError("An error occurred while loading wallets")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletTypeSelect = (walletType: string) => {
    setSelectedWalletType(walletType)
    setConnectionStep("connect")

    // Pre-fill wallet name
    const wallet = walletTypes.find((w) => w.id === walletType)
    setWalletForm((prev) => ({
      ...prev,
      name: wallet?.name || "",
    }))
  }

  const connectWalletAutomatically = async () => {
    try {
      if (selectedWalletType === "metamask") {
        // Check if MetaMask is installed
        if (typeof window === "undefined" || !window.ethereum) {
          // Instead of throwing an error, show a helpful message and redirect to manual entry
          setError("MetaMask not detected. Please install MetaMask extension or enter wallet details manually.")
          setConnectionStep("manual")
          return
        }

        // Check if it's actually MetaMask (not another wallet)
        if (!window.ethereum.isMetaMask) {
          setError("Please use MetaMask extension for automatic connection, or enter details manually.")
          setConnectionStep("manual")
          return
        }

        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts && accounts.length > 0) {
          const publicAddress = accounts[0]

          // Get balance (optional)
          try {
            const balance = await window.ethereum.request({
              method: "eth_getBalance",
              params: [publicAddress, "latest"],
            })

            // Convert balance from wei to ETH
            const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)

            setWalletForm((prev) => ({
              ...prev,
              publicAddress,
              balance: balanceInEth.toFixed(4),
              currency: "ETH",
            }))
          } catch (balanceError) {
            // If balance fetch fails, still proceed with the address
            setWalletForm((prev) => ({
              ...prev,
              publicAddress,
              balance: "0",
              currency: "ETH",
            }))
          }

          setConnectionStep("success")
        } else {
          setError("No accounts found. Please make sure MetaMask is unlocked.")
          setConnectionStep("manual")
        }
      } else {
        // For other wallets, show manual entry
        setConnectionStep("manual")
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)

      // Handle specific MetaMask errors
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          setError("Connection cancelled. You can still enter wallet details manually.")
        } else if (error.message.includes("MetaMask")) {
          setError("MetaMask connection failed. Please try again or enter details manually.")
        } else {
          setError("Wallet connection failed. Please enter details manually.")
        }
      } else {
        setError("Wallet connection failed. Please enter details manually.")
      }

      setConnectionStep("manual")
    }
  }

  const saveWallet = async () => {
    try {
      if (!walletForm.publicAddress) {
        setError("Public address is required")
        return
      }

      const walletData = {
        name: walletForm.name,
        type: selectedWalletType,
        publicAddress: walletForm.publicAddress,
        privateKey: walletForm.privateKey || undefined,
        seedPhrase: walletForm.seedPhrase || undefined,
        balance: Number.parseFloat(walletForm.balance) || 0,
        currency: walletForm.currency,
      }

      const response = await fetch("/api/backup/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(walletData),
      })

      if (response.ok) {
        const data = await response.json()
        setWallets((prev) => [...prev, data.wallet])
        resetForm()
        setShowAddModal(false)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to save wallet")
      }
    } catch (error) {
      setError("An error occurred while saving the wallet")
    }
  }

  const deleteWallet = async (walletId: string) => {
    try {
      const response = await fetch(`/api/backup/wallets/${walletId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWallets((prev) => prev.filter((w) => w.id !== walletId))
        setShowWalletModal(false)
      } else {
        setError("Failed to delete wallet")
      }
    } catch (error) {
      setError("An error occurred while deleting the wallet")
    }
  }

  const resetForm = () => {
    setWalletForm({
      name: "",
      publicAddress: "",
      privateKey: "",
      seedPhrase: "",
      balance: "",
      currency: "USD",
    })
    setSelectedWalletType("")
    setConnectionStep("select")
    setError("")
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

  const togglePrivateDataVisibility = (walletId: string) => {
    setShowPrivateData((prev) => ({
      ...prev,
      [walletId]: !prev[walletId],
    }))
  }

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatSeedPhrase = (seedPhrase: string) => {
    return seedPhrase.split(" ").map((word, index) => (
      <Badge key={index} variant="secondary" className="m-1">
        {index + 1}. {word}
      </Badge>
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your backup wallets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Goldman Chest
          </h2>
          <p className="text-muted-foreground">Securely backup and manage your cryptocurrency wallets</p>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Backup Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {connectionStep === "select" && "Select Wallet Type"}
                {connectionStep === "connect" && "Connect Wallet"}
                {connectionStep === "manual" && "Enter Wallet Details"}
                {connectionStep === "success" && "Wallet Connected"}
              </DialogTitle>
              <DialogDescription>
                {connectionStep === "select" && "Choose the type of wallet you want to backup"}
                {connectionStep === "connect" && "Connect your wallet automatically"}
                {connectionStep === "manual" && "Manually enter your wallet information"}
                {connectionStep === "success" && "Review and save your wallet backup"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {connectionStep === "select" && (
                <div className="space-y-3">
                  {walletTypes.map((wallet) => (
                    <Card
                      key={wallet.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleWalletTypeSelect(wallet.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center`}
                        >
                          <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{wallet.name}</h3>
                          <p className="text-sm text-muted-foreground">{wallet.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {connectionStep === "connect" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Connect {walletTypes.find((w) => w.id === selectedWalletType)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedWalletType === "metamask"
                        ? "Click connect to automatically import your MetaMask wallet details, or enter manually if MetaMask isn't installed."
                        : "Click connect to automatically import your wallet details, or enter manually."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setConnectionStep("manual")} className="flex-1">
                      Enter Manually
                    </Button>
                    <Button onClick={connectWalletAutomatically} className="flex-1">
                      {selectedWalletType === "metamask" ? "Connect MetaMask" : "Connect Wallet"}
                    </Button>
                  </div>

                  {selectedWalletType === "metamask" && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Don't have MetaMask?</p>
                      <p>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Download MetaMask extension
                        </a>{" "}
                        or use manual entry instead.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(connectionStep === "manual" || connectionStep === "success") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Wallet Name</Label>
                    <Input
                      id="name"
                      value={walletForm.name}
                      onChange={(e) => setWalletForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="My MetaMask Wallet"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicAddress">Public Address *</Label>
                    <Input
                      id="publicAddress"
                      value={walletForm.publicAddress}
                      onChange={(e) => setWalletForm((prev) => ({ ...prev, publicAddress: e.target.value }))}
                      placeholder="0x..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Balance (Optional)</Label>
                      <Input
                        id="balance"
                        type="number"
                        step="0.0001"
                        value={walletForm.balance}
                        onChange={(e) => setWalletForm((prev) => ({ ...prev, balance: e.target.value }))}
                        placeholder="0.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={walletForm.currency}
                        onValueChange={(value) => setWalletForm((prev) => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="BNB">BNB</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privateKey">Private Key (Optional)</Label>
                    <Input
                      id="privateKey"
                      type="password"
                      value={walletForm.privateKey}
                      onChange={(e) => setWalletForm((prev) => ({ ...prev, privateKey: e.target.value }))}
                      placeholder="Enter private key for enhanced backup"
                    />
                    <p className="text-xs text-muted-foreground">Private keys are encrypted and stored securely</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seedPhrase">Seed Phrase (Optional)</Label>
                    <Textarea
                      id="seedPhrase"
                      value={walletForm.seedPhrase}
                      onChange={(e) => setWalletForm((prev) => ({ ...prev, seedPhrase: e.target.value }))}
                      placeholder="Enter your 12 or 24 word seed phrase"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Seed phrases are encrypted and stored securely</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={saveWallet} className="flex-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Backup Wallet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
            <p className="text-xs text-muted-foreground">Backed up securely</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all wallets</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Lock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">High</div>
            <p className="text-xs text-muted-foreground">Quantum encrypted</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Grid */}
      {wallets.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Backup Wallets</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start backing up your cryptocurrency wallets to keep them safe and secure.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Backup Your First Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                        walletTypes.find((w) => w.id === wallet.type)?.color || "from-gray-500 to-gray-600"
                      } flex items-center justify-center`}
                    >
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{wallet.name}</CardTitle>
                      <CardDescription className="capitalize">{wallet.type.replace("_", " ")}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={wallet.isEncrypted ? "default" : "secondary"}>
                    {wallet.isEncrypted ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                    {wallet.isEncrypted ? "Encrypted" : "Plain"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{formatAddress(wallet.publicAddress)}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(wallet.publicAddress, `address-${wallet.id}`)}
                      >
                        {copiedField === `address-${wallet.id}` ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {wallet.balance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance:</span>
                      <span className="text-sm font-medium">
                        {wallet.balance.toLocaleString()} {wallet.currency}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(wallet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedWallet(wallet)
                    setShowWalletModal(true)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Wallet Details Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              {selectedWallet?.name}
            </DialogTitle>
            <DialogDescription>Wallet details and backup information</DialogDescription>
          </DialogHeader>

          {selectedWallet && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={selectedWallet.publicAddress} size={150} />
                </div>
              </div>

              {/* Wallet Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Public Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={selectedWallet.publicAddress} readOnly className="font-mono text-xs" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedWallet.publicAddress, "modal-address")}
                    >
                      {copiedField === "modal-address" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {selectedWallet.privateKey && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Private Key</Label>
                      <Button variant="ghost" size="sm" onClick={() => togglePrivateDataVisibility(selectedWallet.id)}>
                        {showPrivateData[selectedWallet.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type={showPrivateData[selectedWallet.id] ? "text" : "password"}
                        value={selectedWallet.privateKey}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedWallet.privateKey!, "modal-private")}
                      >
                        {copiedField === "modal-private" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedWallet.seedPhrase && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Seed Phrase</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePrivateDataVisibility(`${selectedWallet.id}-seed`)}
                      >
                        {showPrivateData[`${selectedWallet.id}-seed`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {showPrivateData[`${selectedWallet.id}-seed`] ? (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex flex-wrap gap-1">{formatSeedPhrase(selectedWallet.seedPhrase)}</div>
                      </div>
                    ) : (
                      <Input type="password" value="••••••••••••••••••••••••" readOnly />
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="destructive" onClick={() => deleteWallet(selectedWallet.id)} className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setShowWalletModal(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
