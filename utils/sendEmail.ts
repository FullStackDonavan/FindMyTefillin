// server/utils/sendEmail.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
      reply_to: replyTo,
    })

    console.log('✅ Email sent:', result)
    return result
  } catch (error) {
    console.error('❌ Email send failed:', error)
    throw error
  }
}
