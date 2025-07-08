// ~/server/api/registered-tefillin/lookup.ts
import { getQuery, createError } from 'h3'
import prisma from '~/server/database/client'

export default defineEventHandler(async (event) => {
  try {
    const { idTag } = getQuery(event)

    if (!idTag || typeof idTag !== 'string') {
      throw createError({ statusCode: 400, message: 'Missing or invalid idTag' })
    }

    const registered = await prisma.registeredTefillin.findUnique({
      where: { idTag },
    })

    if (!registered) {
      return { found: false }
    }

    // ✅ Update status to "found" if not already
    if (registered.status !== 'found') {
      await prisma.registeredTefillin.update({
        where: { idTag },
        data: { status: 'found' },
      })
    }

    return { found: true }
  } catch (error) {
    console.error('❌ Error in /api/registered-tefillin/lookup:', error)
    throw createError({ statusCode: 500, message: error.message || 'Lookup failed' })
  }
})
