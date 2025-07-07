import { readMultipartFormData } from 'h3'
import prisma from '~/server/database/client'
import { sendEmail } from '~/utils/sendEmail'


export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    const fields: Record<string, string> = {}
    let photoFile: any = null

    for (const part of formData || []) {
      if (part.type === 'file') {
        photoFile = part
      } else {
        fields[part.name] = part.data
      }
    }

    // Upload photo if provided (assuming you have a /uploads folder or S3)
    let photoUrl = null
    if (photoFile) {
      const fileName = `tefillin_${Date.now()}_${photoFile.filename}`
      const filePath = `./public/uploads/${fileName}`
      await Bun.write(filePath, photoFile.data)
      photoUrl = `/uploads/${fileName}`
    }

    // Save to database
    const lostReport = await prisma.lostTefillinReport.create({
      data: {
        idTag: fields.idTag,
        registered: fields.registered === 'true',
        qrAttached: fields.qrAttached === 'true',
        firstName: fields.firstName,
        lastName: fields.lastName,
        phone: fields.phone,
        alternatePhone: fields.alternatePhone,
        email: fields.email,
        location: fields.location,
        photoUrl,
      },
    })

    // Send confirmation email (admin + user)
    const message = `
      <p><strong>${fields.firstName} ${fields.lastName}</strong> has reported lost tefillin.</p>
      <p><strong>ID Tag:</strong> ${fields.idTag}</p>
      <p><strong>Location:</strong> ${fields.location}</p>
      <p><strong>Phone:</strong> ${fields.phone}</p>
      <p><strong>Alternate Phone:</strong> ${fields.alternatePhone}</p>
      <p><strong>Email:</strong> ${fields.email}</p>
      ${photoUrl ? `<p><img src="${photoUrl}" alt="Tefillin Bag" width="300"/></p>` : ''}
    `

    await sendEmail({
      to: [fields.email, 'admin@findmytefilin.com'],
      subject: 'Lost Tefillin Report Submitted',
      html: message,
    })

    return { success: true }
  } catch (error) {
    console.error('❌ Error submitting lost tefillin report:', error)
    return { success: false, message: 'Failed to process report.' }
  }
})
