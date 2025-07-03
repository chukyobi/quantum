import nodemailer from "nodemailer"

/**
 * Sends a verification email using Gmail SMTP.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The 6-digit OTP code to include in the email.
 * @returns {Promise<boolean>} - Returns true if email sent successfully.
 */
async function sendVerificationEmail(to: string, otp: string): Promise<boolean> {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password (not regular password)
      },
    })

    // Verify connection configuration
    await transporter.verify()

    // Email content with professional styling
    const mailOptions = {
      from: {
        name: "Goldman Private",
        address: process.env.GMAIL_USER || "no-reply@goldmanprivate.com",
      },
      to: to,
      subject: "Verify Your Goldman Account - 6-Digit Code",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                Welcome to Goldman!
              </h1>
              <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 16px;">
                Secure your financial future with us
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                Verify Your Account
              </h2>
              
              <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                Thank you for signing up with Goldman! To complete your registration and secure your account, please use the verification code below:
              </p>

              <!-- OTP Code Box -->
              <div style="background-color: #f9fafb; border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; display: inline-block; border: 1px solid #e5e7eb;">
                  <span style="font-size: 36px; font-weight: 700; color: #1f2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </span>
                </div>
              </div>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>⏰ Important:</strong> This verification code will expire in <strong>15 minutes</strong> for your security.
                </p>
              </div>

              <p style="color: #4b5563; margin: 30px 0 0 0; font-size: 16px; line-height: 1.6;">
                Simply enter this code on the verification page to activate your account and start managing your finances with Goldman.
              </p>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                🔒 Security Notice
              </h3>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Never share this code with anyone</li>
                <li style="margin-bottom: 8px;">Goldman will never ask for this code via phone or email</li>
                <li style="margin-bottom: 8px;">If you didn't create this account, please ignore this email</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                Need help? Contact our support team
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">
                © 2024 Goldman Private. All rights reserved.
              </p>
            </div>

          </div>

          <!-- Footer Text -->
          <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent to ${to}. If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
        Welcome to Goldman!
        
        Thank you for signing up! To verify your account, please use this 6-digit code:
        
        ${otp}
        
        This code will expire in 15 minutes for security reasons.
        
        If you didn't create an account with Goldman, please ignore this email.
        
        Best regards,
        The Goldman Team
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log("✅ Verification email sent successfully to:", to)
    console.log("📧 Message ID:", info.messageId)

    return true
  } catch (error: any) {
    console.error("❌ Error sending verification email:", error)

    // Log specific error details for debugging
    if (error.code === "EAUTH") {
      console.error("🔐 Authentication failed. Check your Gmail credentials and App Password.")
    } else if (error.code === "ECONNECTION") {
      console.error("🌐 Connection failed. Check your internet connection and SMTP settings.")
    } else if (error.code === "EMESSAGE") {
      console.error("📝 Message error. Check your email content and recipient address.")
    }

    return false
  }
}

export default sendVerificationEmail
