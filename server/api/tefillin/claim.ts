import { getHeader, readBody, createError } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

export default defineEventHandler(async (event) => {
  const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await getUserByAuthToken(authToken)
  if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

  const { registeredTefillinId } = await readBody(event)
  if (!registeredTefillinId) throw createError({ statusCode: 400, message: 'Missing ID' })

  const tefillin = await prisma.registeredTefillin.findFirst({
    where: {
      id: registeredTefillinId,
      userId: user.id,
    },
  })

  if (!tefillin) throw createError({ statusCode: 404, message: 'Tefillin not found or not yours' })

  await prisma.registeredTefillin.update({
    where: { id: tefillin.id },
    data: {
      status: 'returned',
    },
  })

  await prisma.foundPost.updateMany({
    where: { idTag: tefillin.idTag },
    data: { status: 'claimed' },
  })

  return { success: true, message: 'Tefillin claimed and status updated' }
})
