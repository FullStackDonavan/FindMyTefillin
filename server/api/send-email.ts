// server/api/send-email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  const { replyTo, message } = await readBody(event)

  if (!replyTo || !message) {
    setResponseStatus(event, 400)
    return { error: 'Missing email or message' }
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'donavanjones79@gmail.com',
      subject: 'Tefillin Bag Found!',
      html: `
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Reply to:</strong> ${replyTo}</p>
      `,
      reply_to: replyTo,
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { error: 'Failed to send email' }
  }
})
