// server/utils/sendEmail.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({ to, subject, html, replyTo }: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) => {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html,
    reply_to: replyTo,
  })
}
