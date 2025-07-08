import { getHeader, createError } from 'h3'
import { getUserByAuthToken } from '~/server/database/repositories/sessionRepository'
import prisma from '~/server/database/client'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!authToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const user = await getUserByAuthToken(authToken)
    if (!user) throw createError({ statusCode: 403, message: 'Invalid token' })

    const foundPosts = await prisma.foundPost.findMany({
      where: { userId: user.id },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, posts: foundPosts }
  } catch (error) {
    console.error('❌ Error in /api/user/found-posts:', error)
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch found posts' })
  }
})
