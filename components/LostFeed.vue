<template>
  <div class="feed-container mx-auto">
    <h2 class="text-xl font-semibold my-4 text-gray-800 dark:text-gray-100">Lost Packages</h2>

    <div v-if="loading" class="text-center text-gray-600 dark:text-gray-300">Loading packages...</div>
    <div v-else-if="error" class="text-red-500 dark:text-red-400">{{ error }}</div>
    
    <div v-else>
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card bg-white dark:bg-gray-800 shadow-md p-4 rounded-xl mb-6 transition-all border border-gray-200 dark:border-gray-700"
      >
      <!-- Package Image -->
        
        <div v-if="post.content.photoUrl" class="mt-2">
          <img :src="post.content.photoUrl" alt="Photo" class="w-full max-h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
        </div>

        <!-- User Info -->
        <div class="flex items-center mb-4">
          <img
            v-if="post.user.avatar"
            :src="post.user.avatar"
            alt="User Avatar"
            class="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div class="text-gray-800 dark:text-gray-100 font-semibold">
            {{ post.user.firstName }} {{ post.user.lastName }}
          </div>
        </div>

        

       <!-- Package Details -->
      <div class="space-y-2 text-gray-700 dark:text-gray-200">
        <div class="flex items-center space-x-2">
          <span class="font-semibold">📦 Package ID Tag:</span>
          <span class="text-gray-900 dark:text-white tracking-wide">{{ post.content.idTag || post.content.idCode }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">✅ Registered:</span>
          <span>{{ post.content.registered ? "Yes" : "No" }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">🔖 QR Attached:</span>
          <span>{{ post.content.qrAttached ? "Yes" : "No" }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">👤 First Name:</span>
          <span>{{ post.content.firstName }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">👥 Last Name:</span>
          <span>{{ post.content.lastName }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">📞 Phone:</span>
          <span>{{ post.content.phone }}</span>
        </div>
        <div class="flex items-center space-x-2" v-if="post.content.alternatePhone">
          <span class="font-semibold">📞 Alternate Phone:</span>
          <span>{{ post.content.alternatePhone }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">📧 Email:</span>
          <span>{{ post.content.email }}</span>
        </div>
        <div class="flex items-start space-x-2">
          <span class="font-semibold mt-1">📍 Location:</span>
          <span class="text-gray-800 dark:text-gray-100">{{ post.content.location }}</span>
        </div>
      </div>



        <!-- Timestamp -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right">
          🕒 Posted on {{ new Date(post.createdAt).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const posts = ref([])
const loading = ref(false)
const error = ref(null)
const reactionTypes = ["👍", "❤️", "😂", "🙏"]
const userReactions = ref({}) // Track the selected reaction per post
const showReactionMenu = ref(null) // Track which post's reaction menu is visible
let holdTimeout = null // Timer for press-and-hold (use let here because it's not reactive)
const loggedInUserId = ref(null) // Track the logged-in user's ID

async function fetchUserData() {
  try {
    const authToken = Cookies.get("auth_token")
    if (!authToken) throw new Error("Authentication token missing.")

    const response = await fetch("/api/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
    })

    if (!response.ok) throw new Error(`API request failed: ${response.status}`)

    const data = await response.json()
    if (!data.success) throw new Error("Invalid API response format")

    loggedInUserId.value = data.user.id
  } catch (err) {
    console.error("❌ Failed to fetch user data:", err)
    error.value = "Failed to load user data. Please refresh."
  }
}

async function fetchPosts() {
  loading.value = true
  try {
    const authToken = Cookies.get("auth_token")
    if (!authToken) throw new Error("Authentication token missing.")

    const response = await fetch("/api/user/lost-reports", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
    })

    const data = await response.json()
    if (!data.success) throw new Error(data.message)

    posts.value = data.posts
  } catch (err) {
    error.value = err.message || "Failed to load lost reports."
  } finally {
    loading.value = false
  }
}

function parseContent(content) {
  try {
    return typeof content === "string" ? JSON.parse(content) : content
  } catch (error) {
    console.error("❌ Error parsing post content:", error)
    return { title: "Error loading content", arguments: [] } // Return a safe fallback
  }
}

function getImageUrl(post) {
  if (post.imageUrl) return post.imageUrl
  if (post.content && post.content.imageId) return `/uploads/${post.content.imageId}`
  return null
}

async function addReaction(post, reactionType) {
  const authToken = Cookies.get("auth_token")
  const previousReaction = userReactions.value[post.id] // Store the old reaction
  userReactions.value[post.id] = reactionType

  try {
    const response = await fetch("/api/posts/reactions", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id, reactionType }),
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || "Reaction update failed")
    }
  } catch (error) {
    console.error("❌ Failed to update reaction:", error)
    userReactions.value[post.id] = previousReaction // Revert UI if API fails
    await fetchPosts()
  }
}

function startHold(postId) {
  holdTimeout = setTimeout(() => {
    showReactionMenu.value = postId
  }, 500) // Hold for 500ms to show reaction menu
}

function stopHold() {
  clearTimeout(holdTimeout)
}

onMounted(async () => {
  await fetchUserData()
  await fetchPosts()
})
</script>

<style scoped>
/* Add animation for reaction menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
