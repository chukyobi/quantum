import { z } from "zod"

// User validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
})

export const otpSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
})

// Transaction validation
export const transactionSchema = z.object({
  userEmail: z.string().email("Invalid email address").toLowerCase(),
  transactionType: z.enum(["deposit", "withdraw"]),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum(["pending", "successful", "failed"]).optional(),
})

// Backup wallet validation
export const backupWalletSchema = z.object({
  name: z.string().min(1, "Wallet name is required"),
  logo: z.string().optional(),
  publicAddress: z.string().optional(),
  seedPhrase: z.string().optional(),
  privateKey: z.string().optional(),
  qrCodeData: z.string().optional(),
  manualBackup: z.record(z.any()).optional(),
  balance: z.number().min(0).optional(),
  currency: z.string().optional(),
})

// Email list validation
export const emailListSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
})
