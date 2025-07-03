import prisma from "./prisma"

/**
 * Utility functions for database operations
 */

// Get user with all related data
export async function getUserWithRelations(email: string) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      wallets: true,
      backupWallets: true,
      transactions: {
        orderBy: { transactionDate: "desc" },
        take: 10, // Get last 10 transactions
      },
    },
  })
}

// Create a transaction record
export async function createTransaction(data: {
  userEmail: string
  transactionType: "deposit" | "withdraw"
  amount: number
  currency: string
  status?: "pending" | "successful" | "failed"
}) {
  return await prisma.transaction.create({
    data: {
      userEmail: data.userEmail.toLowerCase(),
      transactionType: data.transactionType,
      amount: data.amount,
      currency: data.currency,
      status: data.status || "pending",
    },
  })
}

// Add email to email list (for newsletter/marketing)
export async function addToEmailList(email: string) {
  try {
    return await prisma.emailList.create({
      data: {
        email: email.toLowerCase(),
        status: "pending",
      },
    })
  } catch (error: any) {
    // If email already exists, just return the existing record
    if (error.code === "P2002") {
      return await prisma.emailList.findUnique({
        where: { email: email.toLowerCase() },
      })
    }
    throw error
  }
}

// Update wallet balance
export async function updateWalletBalance(walletId: string, newBalance: number) {
  return await prisma.wallet.update({
    where: { walletId },
    data: { balance: newBalance },
  })
}

// Update backup wallet details
export async function updateBackupWallet(
  id: number,
  data: {
    publicAddress?: string
    seedPhrase?: string
    privateKey?: string
    qrCodeData?: string
    manualBackup?: any
    balance?: number
  },
) {
  return await prisma.backupWallet.update({
    where: { id },
    data,
  })
}

// Clean up expired OTPs (run this periodically)
export async function cleanupExpiredOTPs() {
  const result = await prisma.user.updateMany({
    where: {
      otpExpires: {
        lt: new Date(),
      },
    },
    data: {
      otp: null,
      otpExpires: null,
    },
  })

  console.log(`🧹 Cleaned up ${result.count} expired OTPs`)
  return result
}
