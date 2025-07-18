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
    if (!user) throw createError({ statusCode: 403, message: 'Invalid authentication token.' })

    const body = await readBody(event)

    const requiredFields = [
      'idTag', 'registered', 'qrAttached', 'firstName', 'lastName',
      'phone', 'email', 'location'
    ]
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        throw createError({ statusCode: 400, message: `Missing field: ${field}` })
      }
    }

    const registered = (typeof body.registered === 'string')
      ? body.registered.toLowerCase() === 'true'
      : Boolean(body.registered)

    const qrAttached = (typeof body.qrAttached === 'string')
      ? body.qrAttached.toLowerCase() === 'true'
      : Boolean(body.qrAttached)

    let photoUrl = null
    if (body.photoId) {
      const photoRecord = await prisma.photo.findUnique({
        where: { id: body.photoId }
      })
      if (photoRecord) {
        photoUrl = photoRecord.url
      }
    }

    // STEP 1: Create RegisteredTefillin if not registered
    let registeredTefillin = null
    if (!registered) {
      registeredTefillin = await prisma.registeredTefillin.create({
        data: {
          userId: user.id,
          idTag: body.idTag,
          qrAttached,
          status: 'lost',
          photoUrl,
        },
      })
    }

    // STEP 2: Create LostTefillinReport and link to RegisteredTefillin (if applicable)
    const lostReport = await prisma.lostTefillinReport.create({
  data: {
    userId: user.id,
    idTag: body.idTag,
    registered,
    qrAttached,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    alternatePhone: body.alternatePhone || null,
    email: body.email,
    location: body.location,
    photoUrl,
    registeredTefillinId: registeredTefillin?.id || null,
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



    return { success: true, report: lostReport }
  } catch (error) {
    console.error('❌ Error submitting lost tefillin report:', error)
    return {
      success: false,
      message: error.message || 'Server Error',
    }
  }
})
