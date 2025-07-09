// /api/tefillin/update-status.ts
import { getHeader, readBody, createError } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const user = await getUserByAuthToken(authToken)
    if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

    const body = await readBody(event)
    const { tefillinId, newStatus } = body

    if (!tefillinId || !newStatus) {
      throw createError({ statusCode: 400, message: 'Missing tefillinId or newStatus' })
    }

    // Optionally validate status transitions here, e.g. only allow certain changes
    const allowedStatuses = ['foundButLost', 'found', 'active']
    if (!allowedStatuses.includes(newStatus)) {
      throw createError({ statusCode: 400, message: 'Invalid status' })
    }

    // Confirm the tefillin belongs to the user or has permission
    const tefillin = await prisma.registeredTefillin.findUnique({
      where: { id: tefillinId }
    })

    if (!tefillin) throw createError({ statusCode: 404, message: 'Tefillin not found' })

    if (tefillin.userId !== user.id) {
      throw createError({ statusCode: 403, message: 'No permission to update this tefillin' })
    }

    // Update status
    const updated = await prisma.registeredTefillin.update({
      where: { id: tefillinId },
      data: { status: newStatus }
    })

    return { success: true, tefillin: updated }
  } catch (error) {
    console.error('❌ Error updating tefillin status:', error)
    throw createError({ statusCode: 500, message: error.message || 'Failed to update status' })
  }
})
