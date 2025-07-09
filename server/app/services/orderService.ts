import prisma from '~/server/database/client'  // Adjust your Prisma client import
import Stripe from 'stripe'

export async function createOrderFromStripeSession(session: Stripe.Checkout.Session) {
  const metadata = session.metadata
  if (!metadata) throw new Error('Missing metadata in Stripe session')

  // Parse userId from metadata (make sure you set this when creating checkout session)
  const userId = Number(metadata.userId)
  if (!userId) throw new Error('User ID missing in Stripe session metadata')

  // Parse total amount from metadata
  const totalAmount = Math.round(parseFloat(metadata.orderTotal) * 100)
  if (isNaN(totalAmount)) throw new Error('Invalid total amount in metadata')

  // You can extend this to include actual order items if you want
  const rawItems = metadata.orderItems
  if (!rawItems) throw new Error('Missing order items in metadata')

  let orderItems = []
  try {
    orderItems = JSON.parse(rawItems).map((item: any) => ({
      description: item.description,
      quantity: item.qty,
      unitPrice: Math.round(item.price * 100),
    }))
  } catch (e) {
    throw new Error('Failed to parse order items JSON')
  }


  // Create the order
  const order = await prisma.order.create({
    data: {
      user: {
        connect: { id: userId },
      },
      totalAmount,
      shippingName: metadata.shippingName,
      shippingAddress: metadata.shippingAddress,
      shippingCity: metadata.shippingCity,
      shippingState: metadata.shippingState,
      shippingZip: metadata.shippingZip,
      shippingPhone: metadata.shippingPhone,
      shippingEmail: metadata.shippingEmail,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string | undefined,
      status: 'paid',
      items: {
        create: orderItems,
      },
    },
  })

  return order
}
