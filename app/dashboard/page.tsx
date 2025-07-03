"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  User,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  CandlestickChartIcon as ChartCandlestick,
  FileLock,
  Search,
  Bell,
  Shield,
  Send,
  Download,
} from "lucide-react"
import Link from "next/link"
import WalletBackupPage from "@/components/WalletBackupPage"
import AddFundsModal from "@/components/AddFundsModal"
import GoldmanX from "@/components/GoldmanX"
import SendMoneyModal from "@/components/SendMoneyModal"
import RequestPaymentModal from "@/components/RequestPaymentModal"

interface UserData {
  id: number
  name: string
  email: string
  isVerified: boolean
  createdAt: string
  wallets: Array<{
    id: number
    walletId: string
    balance: number
    currency: string
  }>
  backupWallets: Array<{
    id: number
    name: string
    logo?: string
    balance: number
    currency?: string
  }>
}

interface Transaction {
  id: string
  type: "deposit" | "withdraw" | "transfer"
  amount: number
  currency: string
  date: string
  status: "completed" | "pending" | "failed"
  method?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBalance, setShowBalance] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState("Dashboard")
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false)
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
  const [isRequestPaymentModalOpen, setIsRequestPaymentModalOpen] = useState(false)

  // Mock data for demonstration
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 1250.0,
      currency: "USD",
      date: "2024-01-15",
      status: "completed",
      method: "PayPal",
    },
    {
      id: "2",
      type: "withdraw",
      amount: 500.0,
      currency: "USD",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "3",
      type: "transfer",
      amount: 750.0,
      currency: "USD",
      date: "2024-01-13",
      status: "pending",
    },
  ])

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()
        if (!data.success || !data.session) {
          router.push("/login")
          return
        }
        await loadUserData()
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      setError("Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleAddFundsSuccess = (amount: number, method: string) => {
    // Update user's wallet balance
    if (user) {
      const updatedUser = {
        ...user,
        wallets: user.wallets.map((wallet) => ({
          ...wallet,
          balance: wallet.balance + amount,
        })),
      }
      setUser(updatedUser)
    }

    // Add transaction to recent transactions
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "deposit",
      amount,
      currency: "USD",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      method,
    }
    setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 4)])

    // Show success message (you can add a toast notification here)
    console.log(`Successfully added $${amount} via ${method}`)
  }

  const handleSendMoneySuccess = (amount: number, recipient: string) => {
    // Update user's wallet balance
    if (user) {
      const updatedUser = {
        ...user,
        wallets: user.wallets.map((wallet) => ({
          ...wallet,
          balance: wallet.balance - amount,
        })),
      }
      setUser(updatedUser)
    }

    // Add transaction to recent transactions
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "transfer",
      amount,
      currency: "USD",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      method: `To ${recipient}`,
    }
    setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 4)])

    console.log(`Successfully sent $${amount} to ${recipient}`)
  }

  const handleRequestPaymentSuccess = (amount: number, from: string) => {
    console.log(`Payment request of $${amount} sent to ${from}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalBalance = user.wallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  const totalBackupBalance = user.backupWallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  const navigationItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Profile", label: "Profile", icon: User },
    { id: "Goldman Chest", label: "Backup Wallets", icon: FileLock },
    { id: "GoldmanX", label: "Goldman X", icon: ChartCandlestick },
    { id: "Settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}! 👋</h2>
              <p className="text-muted-foreground">Here's an overview of your financial portfolio</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Balance */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="h-8 w-8 p-0"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {showBalance ? `$${totalBalance.toLocaleString()}` : "••••••"}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              {/* Active Wallets */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.wallets.length + user.backupWallets.length}</div>
                  <p className="text-xs text-muted-foreground">{user.backupWallets.length} backup wallets</p>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Shield className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Verified</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Fully secured
                  </div>
                </CardContent>
              </Card>

              {/* Member Since */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                  <p className="text-xs text-muted-foreground">Premium member</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Wallet */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          Main Wallet
                        </CardTitle>
                        <CardDescription>Your primary Goldman wallet</CardDescription>
                      </div>
                      <Button
                        onClick={() => setIsAddFundsModalOpen(true)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Funds
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.wallets.map((wallet) => (
                      <div
                        key={wallet.id}
                        className="flex items-center justify-between p-6 border rounded-xl bg-gradient-to-r from-muted/50 to-muted/30"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">Wallet ID: {wallet.walletId}</p>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {wallet.currency}
                            </Badge>
                            Primary Wallet
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-3xl font-bold">
                            {showBalance ? `$${wallet.balance.toLocaleString()}` : "••••••"}
                          </p>
                          <p className="text-sm text-muted-foreground">Available balance</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Recent Transactions
                        </CardTitle>
                        <CardDescription>Your latest financial activities</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "deposit"
                                  ? "bg-green-100 text-green-600"
                                  : transaction.type === "withdraw"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {transaction.type === "deposit" ? (
                                <ArrowDownRight className="h-4 w-4" />
                              ) : transaction.type === "withdraw" ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{transaction.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.method && `via ${transaction.method} • `}
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                            </p>
                            <Badge
                              variant={transaction.status === "completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-primary hover:bg-primary/90"
                      onClick={() => setIsAddFundsModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Funds
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setIsSendMoneyModalOpen(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Money
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setIsRequestPaymentModalOpen(true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Request Payment
                    </Button>
                  </CardContent>
                </Card>

                {/* Backup Wallets */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileLock className="h-5 w-5 text-primary" />
                        Backup Wallets
                      </CardTitle>
                      <Badge variant="secondary">{user.backupWallets.length}</Badge>
                    </div>
                    <CardDescription>Your connected external wallets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-3">
                        {user.backupWallets.map((wallet) => (
                          <div
                            key={wallet.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">{wallet.name[0]}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm">{wallet.name}</div>
                                <div className="text-xs text-muted-foreground">{wallet.currency}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {showBalance ? `$${wallet.balance.toFixed(2)}` : "••••"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "Goldman Chest":
        return <WalletBackupPage />

      case "GoldmanX":
        return <GoldmanX />

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="text-6xl">🚧</div>
              <h3 className="text-xl font-semibold">Coming Soon</h3>
              <p className="text-muted-foreground">This feature is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="lg:hidden">
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-primary">Goldman</span>
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Dashboard
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {user.isVerified && <CheckCircle className="h-3 w-3 text-green-500" />}
                  Verified
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-30 w-64 min-h-screen bg-background border-r transition-transform duration-300 ease-in-out flex flex-col`}
        >
          <div className="flex-1 p-6 space-y-6">
            {/* User Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <div className="text-sm text-muted-foreground">Premium Member</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activePage === item.id ? "default" : "ghost"}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full justify-start ${
                      activePage === item.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Logout Button - Sticky at bottom */}
          <div className="p-6 border-t bg-background">
            <Button onClick={handleLogout} disabled={isLoggingOut} variant="outline" className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{renderContent()}</main>
      </div>

      {/* Modals */}
      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        onSuccess={handleAddFundsSuccess}
      />

      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
        onSuccess={handleSendMoneySuccess}
        userBalance={totalBalance}
      />

      <RequestPaymentModal
        isOpen={isRequestPaymentModalOpen}
        onClose={() => setIsRequestPaymentModalOpen(false)}
        onSuccess={handleRequestPaymentSuccess}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={toggleSidebar} />}
    </div>
  )
}
