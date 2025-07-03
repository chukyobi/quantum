import prisma from "./prisma"

interface CreateUserInput {
  name: string
  email: string
  hashedPassword: string | null // This can be null for OAuth users
  isOAuthUser?: boolean // Add flag to distinguish OAuth users
}

export async function createUserWithWallet(data: CreateUserInput) {
  try {
    if (!data.name || !data.email) {
      throw new Error("Name and email are required.")
    }

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: { wallets: true, backupWallets: true },
    })

    if (existingUser) {
      // If the user already exists, just return the existing user data
      return { user: existingUser, message: "User already exists." }
    }

    // Generate unique wallet ID
    const walletId = `wallet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

    // Use a transaction to ensure all steps are executed atomically
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user first
      const createdUser = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          name: data.name,
          password: data.hashedPassword,
          // Only auto-verify OAuth users, regular signups need email verification
          isVerified: data.isOAuthUser || false,
        },
      })

      // Create the main wallet for the user (using email as foreign key)
      await prisma.wallet.create({
        data: {
          email: createdUser.email, // Direct email reference as per your schema
          walletId,
          balance: 0.0,
          currency: "USD",
        },
      })

      // Default backup wallets configuration
      const defaultBackupWallets = [
        { name: "Metamask", logo: "/assets/metamask.svg", currency: "ETH" },
        { name: "Trust Wallet", logo: "/assets/trust-wallet-token.svg", currency: "Multi" },
        { name: "Binance", logo: "/assets/binance-svgrepo-com.svg", currency: "BNB" },
      ]

      // Create backup wallets (using email as foreign key)
      for (const wallet of defaultBackupWallets) {
        await prisma.backupWallet.create({
          data: {
            email: createdUser.email, // Direct email reference as per your schema
            name: wallet.name,
            logo: wallet.logo,
            balance: 0.0,
            currency: wallet.currency,
          },
        })
      }

      // Return the created user with all related data
      const userWithWallets = await prisma.user.findUnique({
        where: { email: createdUser.email },
        include: {
          wallets: true,
          backupWallets: true,
          transactions: true, // Include transactions as well
        },
      })

      return userWithWallets
    })

    return {
      user: result,
      message: "User, wallet, and backup wallets created successfully.",
    }
  } catch (error: any) {
    console.error("Error creating user with wallet:", error)

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      throw new Error("A user with this email already exists.")
    }

    if (error.code === "P2003") {
      throw new Error("Database constraint violation.")
    }

    // Log the full error for debugging
    console.error("Full error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    })

    throw new Error(`Failed to create user: ${error.message}`)
  }
}
