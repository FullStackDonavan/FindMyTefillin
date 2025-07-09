import Stripe from 'stripe'
import { defineEventHandler, readRawBody, sendError } from 'h3'
import { createOrderFromStripeSession } from '~/server/app/services/orderService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Method not allowed' }))
  }

  const signature = event.node.req.headers['stripe-signature']
  const rawBody = await readRawBody(event)

  if (!signature || !rawBody) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing signature or body' }))
  }

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid signature' }))
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session

    try {
      const order = await createOrderFromStripeSession(session)
      console.log('Order created:', order.id)
      return { message: `Order created for session ${session.id}` }
    } catch (err: any) {
      console.error('Failed to create order from session:', err.message)
      return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to create order' }))
    }
  }

  // For other event types
  return { message: `Unhandled event type ${stripeEvent.type}` }
})
