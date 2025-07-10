import { getHeader, readBody, createError } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

import { sendEmail } from '~/server/utils/sendEmail'
import { orderShippedConfirmation } from '~/server/utils/emailTemplates'

export default defineEventHandler(async (event) => {
  const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await getUserByAuthToken(authToken)
  if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

  const body = await readBody(event)
  const orderId = Number(body.orderId)

  if (!orderId) throw createError({ statusCode: 400, message: 'Missing or invalid orderId' })

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'shipped' },
    })

    // ✅ Send "Order Shipped" email
    await sendEmail({
      to: user.email,
      subject: 'Your Order Has Shipped!',
      html: orderShippedConfirmation({
        name: user.firstName || 'Friend',
        orderId: updatedOrder.id,
        trackingNumber: body.trackingNumber || 'Unavailable',
        carrier: body.carrier || 'Carrier Info Not Provided',
        estimatedDelivery: body.estimatedDelivery || '',
      }),
    })

    return { message: 'Order marked as shipped', order: updatedOrder }
  } catch (error) {
    console.error('Failed to update order status:', error)
    throw createError({ statusCode: 500, message: 'Failed to update order status' })
  }
})
