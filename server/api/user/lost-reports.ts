// server/api/user/lost-reports.ts

import { getHeader } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

export default defineEventHandler(async (event) => {
  const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!authToken) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const user = await getUserByAuthToken(authToken)
  if (!user) {
    throw createError({ statusCode: 403, message: 'Invalid token' })
  }

  const reports = await prisma.lostTefillinReport.findMany({
    include: {
      user: true,
      registeredTefillin: true, // ✅ include the status from registered tefillin
    },
    orderBy: { createdAt: 'desc' },
  })


  return {
    success: true,
    posts: reports.map((report) => ({
      id: `lost-${report.id}`,
      type: 'lost',
      user: report.user,
      createdAt: report.createdAt,
      content: {
        idTag: report.idTag,
        registered: report.registered,
        qrAttached: report.qrAttached,
        firstName: report.firstName,
        lastName: report.lastName,
        phone: report.phone,
        alternatePhone: report.alternatePhone,
        email: report.email,
        location: report.location,
        photoUrl: report.photoUrl || null, // ✅ Use from DB
        registeredTefillinStatus: report.registeredTefillin?.status ?? null,
      },
    })),
  }
})

