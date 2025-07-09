import { getHeader, readBody } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

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

    return { message: 'Order marked as shipped', order: updatedOrder }
  } catch (error) {
    console.error('Failed to update order status:', error)
    throw createError({ statusCode: 500, message: 'Failed to update order status' })
  }
})
