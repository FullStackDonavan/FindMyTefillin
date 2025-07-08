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

    const idTag = content.idCode

    const existingTefillin = await prisma.registeredTefillin.findUnique({
      where: { idTag },
    })

    if (existingTefillin) {
      const lostPost = await prisma.lostPost.findFirst({ where: { idTag } })

      const newStatus = lostPost ? 'foundButLost' : 'found'

      await prisma.registeredTefillin.update({
        where: { idTag },
        data: {
          status: newStatus,
          photoUrl: photo.url,
          userId: lostPost ? existingTefillin.userId : user.id,
        },
      })

      await prisma.foundPost.create({
        data: {
          userId: user.id,
          idTag,
          location: content.location,
          photoUrl: photo.url,
          matchedRegisteredTefillinId: existingTefillin.id,
          status: newStatus,
        },
      })

      return { success: true, updated: true, status: newStatus }
    }

    // Not registered yet — just log the found post
    await prisma.foundPost.create({
      data: {
        userId: user.id,
        idTag,
        location: content.location,
        photoUrl: photo.url,
        status: 'unclaimed',
      },
    })

    return { success: true, updated: false, status: 'unclaimed' }
  } catch (error) {
    console.error('❌ Error in /api/found-post:', error)
    throw createError({ statusCode: 500, message: error.message || 'Internal Server Error' })
  }
})
