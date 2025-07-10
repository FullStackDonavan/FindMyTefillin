import Stripe from 'stripe'
import prisma from '~/server/database/client'
import { sendEmail } from '~/server/utils/sendEmail'
import { orderConfirmation } from '~/server/utils/emailTemplates'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export async function createOrderFromStripeSession(session: Stripe.Checkout.Session) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })

  const userId = parseInt(session.metadata?.userId || '0')
  if (!userId) throw new Error('Missing userId in metadata')

  const shipping = session.customer_details || session.shipping_details

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: session.amount_total || 0,
      status: 'paid',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,

      shippingName: shipping?.name || '',
      shippingAddress: shipping?.address?.line1 || '',
      shippingCity: shipping?.address?.city || '',
      shippingState: shipping?.address?.state || '',
      shippingZip: shipping?.address?.postal_code || '',
      shippingPhone: shipping?.phone || '',
      shippingEmail: shipping?.email || '',

      items: {
        createMany: {
          data: lineItems.data.map((item) => ({
            description: item.description || 'No description',
            quantity: item.quantity || 1,
            unitPrice: ((item.amount_total || 0) / (item.quantity || 1)),
          })),
        },
      },
    },
    include: {
      items: true, // <-- required to generate the email
    },
  })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: 'Your Order Confirmation - FindMyTefillin',
      html: orderConfirmation({
        name: user.firstName || 'Friend',
        orderId: order.id,
        items: order.items.map(i => ({
          description: i.description,
          quantity: i.quantity,
          price: i.unitPrice / 100,
        })),
        total: order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) / 100,
      }),
    })
  }

  return order
}
