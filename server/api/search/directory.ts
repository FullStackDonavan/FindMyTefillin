import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = (getQuery(event).q as string) || ''

  const [users, tefillin] = await Promise.all([
    prisma.user.findMany({
      where: query
        ? {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
      take: 10,
    }),
    prisma.registeredTefillin.findMany({
      where: query
        ? {
            OR: [
              { idTag: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        idTag: true,
        description: true,
        status: true,
      },
      take: 10,
    }),
  ])

  const results: any[] = []
  results.push(...users.map((u) => ({ ...u, type: 'user' })))
  results.push(...tefillin.map((t) => ({ ...t, type: 'tefillin' })))

  return results
})
