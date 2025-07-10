import { getHeader, readBody, createError } from 'h3'
import prisma from '~/server/database/client'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'
import { sendEmail } from '~/server/utils/sendEmail'
import { lostReportConfirmation } from '~/server/utils/emailTemplates'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const user = await getUserByAuthToken(authToken)
    if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

    const body = await readBody(event)
    const { idTag, location = '', description = '' } = body
    if (!idTag) throw createError({ statusCode: 400, message: 'Missing idTag' })

    // Find the user's tefillin
    const tefillin = await prisma.registeredTefillin.findFirst({
      where: {
        userId: user.id,
        idTag,
      },
    })

    if (!tefillin) {
      throw createError({ statusCode: 404, message: 'No tefillin found for this ID tag' })
    }

    // Update the status
    const updated = await prisma.registeredTefillin.update({
      where: { id: tefillin.id },
      data: { status: 'lost' },
    })

    // Log a Lost Report
    await prisma.lostTefillinReport.create({
      data: {
        userId: user.id,
        idTag: updated.idTag,
        registered: true,
        qrAttached: updated.qrAttached,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        alternatePhone: null,
        email: user.email,
        location: '',
        photoUrl: updated.photoUrl || null,
        registeredTefillinId: updated.id,
      },
    })

    await sendEmail({
            to: user.email,
            subject: 'We’ve received your lost tefillin report',
            html: lostReportConfirmation({
              name: user.firstName || 'Friend',
              idTag: body.idTag,
              location: body.location,
              description: body.description || '',
            }),
          })

    return { success: true, message: 'Tefillin marked as lost.' }
  } catch (err) {
    console.error('❌ mark-lost error:', err)
    return {
      success: false,
      message: err.message || 'Server error',
    }
  }
})
