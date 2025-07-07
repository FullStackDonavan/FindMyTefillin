import prisma from "~/server/database/client";
import { getUserByAuthToken } from "~/server/database/repositories/sessionRepository";

export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, "authorization")?.replace("Bearer ", "");
    if (!authToken) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const user = await getUserByAuthToken(authToken);
    if (!user) {
      throw createError({ statusCode: 403, message: "Invalid authentication token." });
    }

    // Fetch user's posts
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Attach image URL from `photoId` inside content
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        let imageUrl = null;

        if (post.content && typeof post.content === "object" && post.content.photoId) {
          const photo = await prisma.photo.findUnique({
            where: { id: post.content.photoId },
            select: { url: true },
          });

          if (photo) {
            imageUrl = photo.url;
          }
        }

        return { ...post, imageUrl };
      })
    );

    return { success: true, posts: formattedPosts };
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return { success: false, message: "Server Error" };
  }
});
