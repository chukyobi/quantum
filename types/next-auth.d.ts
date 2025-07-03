declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      isVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    isVerified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isVerified: boolean
  }
}
