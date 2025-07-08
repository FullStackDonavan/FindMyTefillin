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
    const { content } = body

    if (!content?.idCode || !content?.location || !content?.photoId) {
      throw createError({ statusCode: 400, message: 'Missing required fields' })
    }

    const photo = await prisma.photo.findUnique({ where: { id: content.photoId } })
    if (!photo) throw createError({ statusCode: 404, message: 'Photo not found' })

    // Find the registered tefillin by idTag
    const existingTefillin = await prisma.registeredTefillin.findUnique({
      where: { idTag: content.idCode },
    })

    if (existingTefillin) {
      // Check if there is any lost post for this Tefillin
      const lostPost = await prisma.lostPost.findFirst({
        where: { idTag: content.idCode },
      })

      if (lostPost) {
        // If lost post exists, update status to found and create found post
        await prisma.registeredTefillin.update({
          where: { idTag: content.idCode },
          data: {
            status: 'found',
            photoUrl: photo.url,
            userId: existingTefillin.userId, // keep the original owner or consider updating if needed
          },
        })

        await prisma.foundPost.create({
          data: {
            userId: user.id,
            idTag: content.idCode,
            location: content.location,
            photoUrl: photo.url,
            matchedRegisteredTefillinId: existingTefillin.id,
          },
        })

        return { success: true, updated: true, status: 'found' }
      } else {
        // No lost post exists — register found post and update ownership to current user
        await prisma.registeredTefillin.update({
          where: { idTag: content.idCode },
          data: {
            status: 'found',
            photoUrl: photo.url,
            userId: user.id, // assign ownership to current user who found it
          },
        })

        await prisma.foundPost.create({
          data: {
            userId: user.id,
            idTag: content.idCode,
            location: content.location,
            photoUrl: photo.url,
            matchedRegisteredTefillinId: existingTefillin.id,
          },
        })

        return { success: true, updated: false, status: 'found' }
      }
    }

    // If no registered tefillin found, create found post only
    await prisma.foundPost.create({
      data: {
        userId: user.id,
        idTag: content.idCode,
        location: content.location,
        photoUrl: photo.url,
      },
    })

    return { success: true, updated: false, status: 'unregistered' }
  } catch (error) {
    console.error('❌ Error in /api/found-post:', error)
    throw createError({ statusCode: 500, message: error.message || 'Internal Server Error' })
  }
})
