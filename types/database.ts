import type { User, Wallet, BackupWallet, Transaction } from "@prisma/client"

// Extended types with relations
export type UserWithRelations = User & {
  wallets: Wallet[]
  backupWallets: BackupWallet[]
  transactions: Transaction[]
}

export type UserWithWallets = User & {
  wallets: Wallet[]
  backupWallets: BackupWallet[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface SignupResponse extends ApiResponse {
  data?: {
    user: Partial<User>
  }
}

export interface VerificationResponse extends ApiResponse {
  data?: {
    isVerified: boolean
  }
}

// Form data types
export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface OTPFormData {
  email: string
  otp: string
}

// Transaction types
export type TransactionType = "deposit" | "withdraw"
export type TransactionStatus = "pending" | "successful" | "failed"
export type Currency = "USD" | "BTC" | "ETH" | "BNB" | "Multi"

// Backup wallet types
export interface BackupWalletData {
  name: string
  logo?: string
  publicAddress?: string
  seedPhrase?: string
  privateKey?: string
  qrCodeData?: string
  manualBackup?: Record<string, any>
  balance?: number
  currency?: string
}
