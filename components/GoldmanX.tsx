"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LockIcon,
  TrendingUpIcon,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Target,
  Users,
  Activity,
  PieChart,
  LineChart,
  RefreshCw,
} from "lucide-react"
import TradingViewMarketQuotes from "./TradingViewMarketQuotes"
import TradingViewTimeline from "./TradingViewTimeline"
import TradingViewMarketOverview from "./TradingViewMarketOverview"
import TradingViewSymbolOverview from "./TradingViewSymbolOverview"

interface TradingPackage {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  duration: number // in days
  expectedReturn: number // percentage
  riskLevel: "Low" | "Medium" | "High"
  description: string
  features: string[]
  color: string
  popular?: boolean
}

interface LockedFund {
  id: string
  packageId: string
  packageName: string
  amount: number
  startDate: string
  endDate: string
  expectedReturn: number
  currentReturn: number
  status: "active" | "completed" | "pending"
  dailyReturns: Array<{
    date: string
    return: number
    percentage: number
  }>
}

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  lastUpdate: string
}

const tradingPackages: TradingPackage[] = [
  {
    id: "starter",
    name: "Starter Package",
    minAmount: 100,
    maxAmount: 1000,
    duration: 30,
    expectedReturn: 8,
    riskLevel: "Low",
    description: "Perfect for beginners looking to start their trading journey with minimal risk.",
    features: [
      "Conservative trading strategy",
      "Daily market analysis",
      "24/7 monitoring",
      "Risk management protocols",
      "Weekly performance reports",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "growth",
    name: "Growth Package",
    minAmount: 1000,
    maxAmount: 10000,
    duration: 60,
    expectedReturn: 15,
    riskLevel: "Medium",
    description: "Balanced approach combining growth potential with managed risk for steady returns.",
    features: [
      "Diversified portfolio strategy",
      "Advanced technical analysis",
      "Real-time alerts",
      "Professional risk management",
      "Bi-weekly strategy updates",
      "Priority customer support",
    ],
    color: "from-blue-500 to-cyan-600",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Package",
    minAmount: 10000,
    maxAmount: 100000,
    duration: 90,
    expectedReturn: 25,
    riskLevel: "High",
    description: "High-yield trading package for experienced investors seeking maximum returns.",
    features: [
      "Aggressive growth strategy",
      "AI-powered trading algorithms",
      "Dedicated account manager",
      "Custom risk parameters",
      "Daily performance calls",
      "VIP support channel",
      "Exclusive market insights",
    ],
    color: "from-purple-500 to-pink-600",
  },
]

// Popular symbols to track
const TRACKED_SYMBOLS = [
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", displaySymbol: "BTC/USD" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum", displaySymbol: "ETH/USD" },
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", displaySymbol: "AAPL" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", displaySymbol: "TSLA" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", displaySymbol: "GOOGL" },
]

export default function GoldmanX() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPackage, setSelectedPackage] = useState<TradingPackage | null>(null)
  const [lockAmount, setLockAmount] = useState("")
  const [showLockModal, setShowLockModal] = useState(false)
  const [isLocking, setIsLocking] = useState(false)
  const [userBalance, setUserBalance] = useState(15420.5) // Mock user balance
  const [lockedFunds, setLockedFunds] = useState<LockedFund[]>([
    {
      id: "1",
      packageId: "growth",
      packageName: "Growth Package",
      amount: 5000,
      startDate: "2024-01-01",
      endDate: "2024-03-01",
      expectedReturn: 750,
      currentReturn: 425.5,
      status: "active",
      dailyReturns: [
        { date: "2024-01-15", return: 25.5, percentage: 0.51 },
        { date: "2024-01-14", return: 18.2, percentage: 0.36 },
        { date: "2024-01-13", return: 32.1, percentage: 0.64 },
      ],
    },
  ])
  const [showBalance, setShowBalance] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoadingMarket, setIsLoadingMarket] = useState(true)
  const [lastMarketUpdate, setLastMarketUpdate] = useState<Date | null>(null)

  const totalLockedAmount = lockedFunds.reduce((sum, fund) => sum + fund.amount, 0)
  const totalCurrentReturns = lockedFunds.reduce((sum, fund) => sum + fund.currentReturn, 0)
  const totalExpectedReturns = lockedFunds.reduce((sum, fund) => sum + fund.expectedReturn, 0)

  // Fetch real market data from TradingView-like API
  const fetchMarketData = async () => {
    setIsLoadingMarket(true)
    try {
      // Using a free financial API service (Alpha Vantage alternative)
      // In production, you would use TradingView's official API or similar service
      const promises = TRACKED_SYMBOLS.map(async (item) => {
        try {
          // For crypto symbols, use a different approach
          if (item.symbol.includes("BINANCE")) {
            const cryptoSymbol = item.symbol.split(":")[1].replace("USDT", "")
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${getCoinGeckoId(cryptoSymbol)}&vs_currencies=usd&include_24hr_change=true`,
            )
            const data = await response.json()
            const coinId = getCoinGeckoId(cryptoSymbol)

            if (data[coinId]) {
              return {
                symbol: item.displaySymbol,
                name: item.name,
                price: data[coinId].usd,
                change: (data[coinId].usd * data[coinId].usd_24h_change) / 100,
                changePercent: data[coinId].usd_24h_change || 0,
                lastUpdate: new Date().toISOString(),
              }
            }
          } else {
            // For stocks, use a mock API or real financial API
            // This is a placeholder - in production use real API like Alpha Vantage, IEX Cloud, etc.
            const mockPrice = Math.random() * 200 + 100
            const mockChange = (Math.random() - 0.5) * 10
            return {
              symbol: item.displaySymbol,
              name: item.name,
              price: mockPrice,
              change: mockChange,
              changePercent: (mockChange / mockPrice) * 100,
              lastUpdate: new Date().toISOString(),
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${item.symbol}:`, error)
          return null
        }
      })

      const results = await Promise.all(promises)
      const validResults = results.filter((result): result is MarketData => result !== null)

      setMarketData(validResults)
      setLastMarketUpdate(new Date())
    } catch (error) {
      console.error("Error fetching market data:", error)
      // Fallback to mock data if API fails
      setMarketData([
        {
          symbol: "BTC/USD",
          name: "Bitcoin",
          price: 43250.0,
          change: 1250.5,
          changePercent: 2.98,
          lastUpdate: new Date().toISOString(),
        },
        {
          symbol: "ETH/USD",
          name: "Ethereum",
          price: 2650.0,
          change: -45.2,
          changePercent: -1.68,
          lastUpdate: new Date().toISOString(),
        },
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 185.25,
          change: 2.15,
          changePercent: 1.17,
          lastUpdate: new Date().toISOString(),
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 248.5,
          change: -5.75,
          changePercent: -2.26,
          lastUpdate: new Date().toISOString(),
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 142.8,
          change: 1.95,
          changePercent: 1.38,
          lastUpdate: new Date().toISOString(),
        },
      ])
      setLastMarketUpdate(new Date())
    } finally {
      setIsLoadingMarket(false)
    }
  }

  // Helper function to get CoinGecko ID from symbol
  const getCoinGeckoId = (symbol: string): string => {
    const mapping: { [key: string]: string } = {
      BTC: "bitcoin",
      ETH: "ethereum",
    }
    return mapping[symbol] || symbol.toLowerCase()
  }

  // Fetch market data on component mount and set up auto-refresh
  useEffect(() => {
    fetchMarketData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLockFunds = async () => {
    if (!selectedPackage || !lockAmount) {
      setError("Please select a package and enter an amount")
      return
    }

    const amount = Number.parseFloat(lockAmount)

    if (amount < selectedPackage.minAmount || amount > selectedPackage.maxAmount) {
      setError(`Amount must be between $${selectedPackage.minAmount} and $${selectedPackage.maxAmount}`)
      return
    }

    if (amount > userBalance) {
      setError("Insufficient balance")
      return
    }

    setIsLocking(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newLockedFund: LockedFund = {
        id: Date.now().toString(),
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        expectedReturn: (amount * selectedPackage.expectedReturn) / 100,
        currentReturn: 0,
        status: "active",
        dailyReturns: [],
      }

      setLockedFunds((prev) => [...prev, newLockedFund])
      setUserBalance((prev) => prev - amount)
      setSuccess(`Successfully locked $${amount.toLocaleString()} in ${selectedPackage.name}`)
      setShowLockModal(false)
      setLockAmount("")
      setSelectedPackage(null)
    } catch (error) {
      setError("Failed to lock funds. Please try again.")
    } finally {
      setIsLocking(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-700 bg-green-100 border-green-200"
      case "Medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "High":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateProgress = (fund: LockedFund) => {
    const startDate = new Date(fund.startDate)
    const endDate = new Date(fund.endDate)
    const currentDate = new Date()
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = currentDate.getTime() - startDate.getTime()
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
  }

  return (
    <div className="p-8 bg-white text-gray-900 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
          <BarChart3 className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
          Goldman X
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Advanced AI-powered trading platform that locks your funds and generates consistent returns through
          professional trading strategies.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-white">
            Packages
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-white">
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-white">
            Markets
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Available Balance</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="h-8 w-8 p-0">
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {showBalance ? formatCurrency(userBalance) : "••••••"}
                </div>
                <p className="text-xs text-gray-500">Ready to invest</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Locked Funds</CardTitle>
                <LockIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {showBalance ? formatCurrency(totalLockedAmount) : "••••••"}
                </div>
                <p className="text-xs text-gray-500">{lockedFunds.length} active positions</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Returns</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(totalCurrentReturns) : "••••••"}
                </div>
                <p className="text-xs text-gray-500">
                  {totalLockedAmount > 0 ? `+${((totalCurrentReturns / totalLockedAmount) * 100).toFixed(2)}%` : "0%"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Expected Returns</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {showBalance ? formatCurrency(totalExpectedReturns) : "••••••"}
                </div>
                <p className="text-xs text-gray-500">At maturity</p>
              </CardContent>
            </Card>
          </div>

          {/* About Goldman X */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">About Goldman X</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Goldman X is our revolutionary AI-powered trading platform that combines advanced algorithms with
                    professional trading expertise. When you lock your funds with us, our team of expert traders and AI
                    systems work 24/7 to generate consistent returns.
                  </p>
                  <p className="text-gray-700">
                    Our platform uses sophisticated risk management protocols and diversified trading strategies to
                    maximize returns while protecting your capital. Join thousands of satisfied investors who trust
                    Goldman X with their financial future.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">98.5%</div>
                      <div className="text-sm text-gray-500">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$2.5M+</div>
                      <div className="text-sm text-gray-500">Funds Managed</div>
                    </div>
                  </div>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-purple-50 border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900">Advanced Trading Dashboard</p>
                      <p className="text-sm text-gray-600">Real-time monitoring & analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gray-200 bg-white shadow-sm text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure Fund Locking</h3>
                <p className="text-gray-600">
                  Your funds are secured with military-grade encryption and multi-signature protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm text-center">
              <CardContent className="p-6">
                <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered Trading</h3>
                <p className="text-gray-600">
                  Advanced algorithms analyze market trends and execute optimal trading strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Expert Management</h3>
                <p className="text-gray-600">
                  Professional traders with 10+ years of experience manage your investments.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Choose Your Trading Package</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a package that matches your investment goals and risk tolerance. All packages include professional
              management and 24/7 monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tradingPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`border-gray-200 bg-white shadow-sm relative overflow-hidden ${
                  pkg.popular ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4`}
                  >
                    <TrendingUpIcon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">{pkg.expectedReturn}%</div>
                    <div className="text-sm text-gray-500">Expected return in {pkg.duration} days</div>
                    <Badge className={`${getRiskColor(pkg.riskLevel)}`}>{pkg.riskLevel} Risk</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Min Amount:</span>
                      <span className="text-gray-900">{formatCurrency(pkg.minAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max Amount:</span>
                      <span className="text-gray-900">{formatCurrency(pkg.maxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-900">{pkg.duration} days</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setShowLockModal(true)
                    }}
                    className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white`}
                  >
                    Lock Funds
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {lockedFunds.length} Active Positions
            </Badge>
          </div>

          {lockedFunds.length === 0 ? (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <PieChart className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No Active Positions</h3>
                <p className="text-gray-600 text-center mb-6">
                  Start your trading journey by locking funds in one of our packages.
                </p>
                <Button
                  onClick={() => setActiveTab("packages")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  View Packages
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {lockedFunds.map((fund) => {
                const progress = calculateProgress(fund)
                const daysRemaining = Math.max(
                  0,
                  Math.ceil((new Date(fund.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                )

                return (
                  <Card key={fund.id} className="border-gray-200 bg-white shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{fund.packageName}</CardTitle>
                          <p className="text-sm text-gray-500">Started {fund.startDate}</p>
                        </div>
                        <Badge
                          variant={fund.status === "active" ? "default" : "secondary"}
                          className={
                            fund.status === "active"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {fund.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Locked Amount</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(fund.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Return</p>
                          <p className="text-xl font-bold text-emerald-600">+{formatCurrency(fund.currentReturn)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expected Return</p>
                          <p className="text-xl font-bold text-purple-600">{formatCurrency(fund.expectedReturn)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Days Remaining</p>
                          <p className="text-xl font-bold text-gray-900">{daysRemaining}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-900">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {fund.dailyReturns.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Recent Returns</h4>
                          <div className="space-y-2">
                            {fund.dailyReturns.slice(0, 3).map((dailyReturn, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{dailyReturn.date}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-emerald-600">+{formatCurrency(dailyReturn.return)}</span>
                                  <span className="text-emerald-600">({dailyReturn.percentage.toFixed(2)}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Live Market Data</h2>
              <p className="text-gray-600">Stay updated with real-time market movements and trading opportunities.</p>
            </div>
            <div className="flex items-center gap-4">
              {lastMarketUpdate && (
                <div className="text-sm text-gray-500">Last updated: {lastMarketUpdate.toLocaleTimeString()}</div>
              )}
              <Button
                onClick={fetchMarketData}
                disabled={isLoadingMarket}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingMarket ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Live Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {isLoadingMarket
              ? // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index} className="border-gray-200 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : marketData.map((market) => (
                  <Card key={market.symbol} className="border-gray-200 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{market.symbol}</p>
                          <p className="text-xs text-gray-500">{market.name}</p>
                        </div>
                        {market.changePercent >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(market.price)}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${market.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {market.changePercent >= 0 ? "+" : ""}
                            {formatCurrency(market.change)}
                          </span>
                          <span className={`text-xs ${market.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ({market.changePercent >= 0 ? "+" : ""}
                            {market.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* TradingView Market Overview Widget */}
          <Card className="border-gray-200 bg-white shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="h-5 w-5" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <TradingViewMarketOverview />
              </div>
            </CardContent>
          </Card>

          {/* TradingView Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <LineChart className="h-5 w-5" />
                  Advanced Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TradingViewMarketQuotes />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Activity className="h-5 w-5" />
                  Market Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TradingViewTimeline />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Symbol Overview Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUpIcon className="h-5 w-5" />
                  Bitcoin Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TradingViewSymbolOverview symbol="BINANCE:BTCUSDT" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUpIcon className="h-5 w-5" />
                  Apple Stock Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TradingViewSymbolOverview symbol="NASDAQ:AAPL" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lock Funds Modal */}
      <Dialog open={showLockModal} onOpenChange={setShowLockModal}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Lock Funds - {selectedPackage?.name}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Lock your funds to start earning returns with our professional trading team.
            </DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return:</span>
                  <span className="text-emerald-600 font-medium">{selectedPackage.expectedReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{selectedPackage.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <Badge className={`${getRiskColor(selectedPackage.riskLevel)}`}>{selectedPackage.riskLevel}</Badge>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="lockAmount" className="text-gray-900">
                  Amount to Lock
                </Label>
                <Input
                  id="lockAmount"
                  type="number"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
                  placeholder={`Min: ${formatCurrency(selectedPackage.minAmount)}`}
                  className="bg-white border-gray-300 text-gray-900"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Range: {formatCurrency(selectedPackage.minAmount)} - {formatCurrency(selectedPackage.maxAmount)}
                  </span>
                  <span className="text-gray-500">Available: {formatCurrency(userBalance)}</span>
                </div>
              </div>

              {/* Expected Return Calculation */}
              {lockAmount && Number.parseFloat(lockAmount) > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Expected Return:</span>
                    <span className="text-emerald-600 font-bold text-lg">
                      {formatCurrency((Number.parseFloat(lockAmount) * selectedPackage.expectedReturn) / 100)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Total value at maturity:{" "}
                    {formatCurrency(
                      Number.parseFloat(lockAmount) +
                        (Number.parseFloat(lockAmount) * selectedPackage.expectedReturn) / 100,
                    )}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLockModal(false)}
                  className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLockFunds}
                  disabled={isLocking}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {isLocking ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Locking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LockIcon className="h-4 w-4" />
                      Lock Funds
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
