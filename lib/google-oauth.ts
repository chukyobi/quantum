interface GoogleTokenResponse {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    id_token: string
  }
  
  interface GoogleUserInfo {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
  }
  
  export class GoogleOAuth {
    private clientId: string
    private clientSecret: string
    private redirectUri: string
  
    constructor() {
      this.clientId = process.env.GOOGLE_CLIENT_ID!
      this.clientSecret = process.env.GOOGLE_CLIENT_SECRET!
      this.redirectUri = process.env.GOOGLE_REDIRECT_URI!
    }
  
    // Generate Google OAuth URL
    getAuthUrl(state?: string): string {
      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        ...(state && { state }),
      })
  
      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    }
  
    // Exchange authorization code for access token
    async getAccessToken(code: string): Promise<GoogleTokenResponse> {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to exchange code for token")
      }
  
      return response.json()
    }
  
    // Get user info from Google
    async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch user info")
      }
  
      return response.json()
    }
  
    // Complete OAuth flow
    async handleCallback(code: string): Promise<GoogleUserInfo> {
      const tokenResponse = await this.getAccessToken(code)
      const userInfo = await this.getUserInfo(tokenResponse.access_token)
      return userInfo
    }
  }
  