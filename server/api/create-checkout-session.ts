import Stripe from 'stripe'
import { defineEventHandler, readBody, sendError, createError } from 'h3'
import { getUserByAuthToken } from "~/server/database/repositories/sessionRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Method not allowed' }))
  }

  try {
    // 👇 Fetch authenticated user
    const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })
    const user = await getUserByAuthToken(authToken);
    if (!user || !user.id) {
      return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
    }

    const body = await readBody(event)
    const { items, shipping, total } = body

    if (!items || items.length === 0) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'No items provided' }))
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.description,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order-cancelled`,
      metadata: {
        userId: String(user.id), // ✅ This is now safe
        shippingName: shipping.name,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingZip: shipping.zip,
        shippingPhone: shipping.phone,
        shippingEmail: shipping.email,
        orderTotal: total.toString(),
        orderItems: JSON.stringify(items),
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to create checkout session' }))
  }
})
