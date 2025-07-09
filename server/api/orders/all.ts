import { getHeader } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

export default defineEventHandler(async (event) => {
  const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await getUserByAuthToken(authToken)
  if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

  // Optional: Only allow admins
  // if (!user.isAdmin) throw createError({ statusCode: 403, message: 'Admins only' })

  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return orders
})
