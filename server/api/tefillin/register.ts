import { getHeader, readBody, createError } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'

import { sendEmail } from '~/server/utils/sendEmail'
import { registerReportConfirmation } from '~/server/utils/emailTemplates'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const user = await getUserByAuthToken(authToken)
    if (!user) throw createError({ statusCode: 403, message: 'Invalid token.' })

    const body = await readBody(event)
    const { idTag, qrAttached, description, photoUrl, status } = body

    if (!idTag || typeof qrAttached !== 'boolean') {
      throw createError({ statusCode: 400, message: 'Missing required fields.' })
    }

    const newTefillin = await prisma.registeredTefillin.create({
      data: {
        userId: user.id,
        idTag,
        qrAttached,
        description: description || null,
        photoUrl: photoUrl || null,
        status: status || 'active', // ✅ use provided status, else default to 'active'
      },
    })

    await sendEmail({
            to: user.email,
            subject: 'We’ve received your registeration for your tefillin',
            html: registerReportConfirmation({
              name: user.firstName || 'Friend',
              idTag: body.idTag,
              description: body.description || '',
            }),
          })

    return { success: true, tefillin: newTefillin }
  } catch (error) {
    console.error('❌ Error registering tefillin:', error)
    return { success: false, message: error.message || 'Server error' }
  }
})
