import nodemailer from 'nodemailer';

export interface EmailSendResult {
  success: boolean;
  provider: 'smtp' | 'resend' | 'unconfigured';
  messageId?: string;
  error?: string;
}

/**
 * Checks if a real production email provider is configured via environment variables.
 */
export function isEmailConfigured(): boolean {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '') {
    return true;
  }
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_PASS.includes('placeholder')
  ) {
    return true;
  }
  return false;
}

/**
 * Transmits a 6-digit one-time verification code to an authorized administrator.
 * Security notice: The OTP itself is NEVER logged in production or returned to clients.
 */
export async function sendAdminOtpEmail(toEmail: string, otp: string): Promise<EmailSendResult> {
  const normalizedTo = toEmail.trim().toLowerCase();
  const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || '0XNULL Security <no-reply@0xnull.org>';

  const subject = '0XNULL Admin Portal — One-Time Verification Code';
  const textBody = `0XNULL Administrator Verification\n\nYour one-time administrative verification code is:\n\n${otp}\n\nThis single-use code will expire in 5 minutes. If you did not initiate this administrative login request from /admin, treat this as a potential security event immediately.\n\n— 0XNULL Cybersecurity Club\nDepartment of Cybersecurity, MRCET`;

  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>0XNULL Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #151417;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E8D8C3; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
            <!-- Header -->
            <tr>
              <td style="padding: 28px 32px; background: linear-gradient(135deg, #151417 0%, #2A2830 100%); text-align: center;">
                <span style="font-size: 20px; font-weight: 900; letter-spacing: 0.22em; color: #FAF7F2;">0X<span style="color: #D4AF37;">NULL</span></span>
                <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #C89D3C; font-family: monospace;">Administrator Authentication Gateway</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 36px 32px 28px 32px;">
                <h1 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #151417;">Admin Verification Code</h1>
                <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #55505C;">
                  An administrative access attempt was initiated for your authorized address: <strong style="color: #151417;">${normalizedTo}</strong>. Enter the single-use code below to authorize your session.
                </p>
                <!-- Code Box -->
                <div style="background-color: #FAF7F2; border: 1.5px dashed #D4AF37; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 32px; font-weight: 900; letter-spacing: 0.35em; color: #151417; font-family: monospace; display: inline-block; padding-left: 0.35em;">${otp}</span>
                  <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: 600; color: #8C6B1B; text-transform: uppercase; letter-spacing: 0.1em;">Expires in 5 minutes • Single-Use Only</p>
                </div>
                <!-- Warning Notice -->
                <p style="margin: 0 0 16px 0; font-size: 11px; line-height: 1.5; color: #8A8592;">
                  <strong>Security Advisory:</strong> 0XNULL club leadership will never ask you to disclose this code. If you did not request this code, do not share it with anyone.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 16px 32px; background-color: #FAF7F2; border-top: 1px solid #E8D8C3; text-align: center;">
                <p style="margin: 0; font-size: 10px; color: #8A8592; font-family: monospace;">
                  Department of Cybersecurity • Malla Reddy College of Engineering & Technology
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // 1. Try Resend API if configured
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '') {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [normalizedTo],
          subject,
          text: textBody,
          html: htmlBody
        })
      });

      const resendData = await resendRes.json();
      if (resendRes.ok && resendData?.id) {
        return { success: true, provider: 'resend', messageId: resendData.id };
      }
      return {
        success: false,
        provider: 'resend',
        error: resendData?.message || `Resend error: ${resendRes.status}`
      };
    } catch (err: any) {
      return { success: false, provider: 'resend', error: err?.message || 'Resend request failed' };
    }
  }

  // 2. Try SMTP if configured
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_PASS.includes('placeholder')
  ) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const secure = process.env.SMTP_SECURE === 'true' || port === 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: normalizedTo,
        subject,
        text: textBody,
        html: htmlBody
      });

      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (err: any) {
      return { success: false, provider: 'smtp', error: err?.message || 'SMTP delivery failed' };
    }
  }

  // 3. Fallback: External provider not configured
  // Note: We return unconfigured so the server-side auth layer knows credentials are not yet supplied.
  console.warn(
    `[0XNULL EmailService] Live email delivery provider not configured in environment variables. OTP generated for authorized admin (${normalizedTo.replace(/(?<=.).(?=[^@]*?@)/g, '*')}).`
  );

  return {
    success: false,
    provider: 'unconfigured',
    error: 'External email provider credentials not configured in environment variables.'
  };
}
