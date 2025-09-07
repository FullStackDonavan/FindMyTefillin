import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = (getQuery(event).q as string) || ''
  const filter = (getQuery(event).filter as string) || 'all'

  const results: any[] = []

  // LOST REPORTS
  if (filter === 'all' || filter === 'lost') {
    const lostReports = await prisma.lostTefillinReport.findMany({
      where: query
        ? {
            OR: [
              { idTag: { contains: query, mode: 'insensitive' } },
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        idTag: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        location: true,
        createdAt: true,
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
        results.push(
      ...lostReports.map((r) => ({
        id: r.id,
        tagId: r.idTag,
        description: `Reported lost by ${r.firstName} ${r.lastName}`,
        location: r.location,
        createdAt: r.createdAt,
        type: "lost",
      }))
    )
  }

  // FOUND POSTS
  if (filter === 'all' || filter === 'found') {
    const foundPosts = await prisma.foundPost.findMany({
      where: query
        ? {
            OR: [
              { idTag: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        idTag: true,
        location: true,
        status: true,
        createdAt: true,
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
    results.push(
      ...foundPosts.map((f) => ({
        id: f.id,
        tagId: f.idTag,
        description: `Found item (status: ${f.status})`,
        location: f.location,
        createdAt: f.createdAt,
        type: "found",
      }))
    )
  }

  return results
})
