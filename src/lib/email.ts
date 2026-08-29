import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, firstName: string, resetUrl: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@lcccs.edu',
      to: email,
      subject: 'Password Reset Request - LCCCS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
            }
            .content {
              background: white;
              padding: 25px;
              border-radius: 6px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: #1e40af;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button:hover {
              background: #1e3a8a;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 20px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LCCCS</div>
              <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
              <p>Hello ${firstName},</p>
              
              <p>We received a request to reset your password for your LCCCS account. If you made this request, please click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #1e40af;">${resetUrl}</p>
              
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for your security. If you did not request this password reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>LCCCS Support Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Liberian Center for Cross Cultural Studies. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
