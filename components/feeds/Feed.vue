<template>
  <div class="feed-container mx-auto">
    <h2 class="text-xl font-semibold my-4 text-gray-800 dark:text-gray-100">Found Packages</h2>

    <div v-if="loading" class="text-center text-gray-600 dark:text-gray-300">Loading packages...</div>
    <div v-else-if="error" class="text-red-500 dark:text-red-400">{{ error }}</div>
    
    <div v-else>
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card bg-white dark:bg-gray-800 shadow-md p-4 rounded-xl mb-6 transition-all border border-gray-200 dark:border-gray-700"
      >
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

        <!-- Package Image -->
        <div class="mb-4">
          <img
            :src="getImageUrl(post)"
            alt="Post Image"
            class="w-full max-h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>

        <!-- Package Details -->
        <div class="space-y-2 text-gray-700 dark:text-gray-200">
          <div class="flex items-center space-x-2">
            <span class="font-semibold">📦 Package ID:</span>
            <span class="text-gray-900 dark:text-white tracking-wide">{{ post.idTag }}</span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="font-semibold mt-1">📍 Location:</span>
            <span class="text-gray-800 dark:text-gray-100">{{ post.location }}</span>
          </div>
        </div>

        <!-- Package Status Badge -->
        <div class="mt-2">
          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(post.status)">
            {{ post.status || 'unknown' }}
          </span>
        </div>


        <!-- Timestamp -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right">
          🕒 Posted on {{ new Date(post.createdAt).toLocaleString() }}
        </p>
      </div>

    </div>
  </div>
</template>

  
  <script>
  import Cookies from "js-cookie";
  
  export default {
    data() {
      return {
        posts: [],
        loading: false,
        error: null,
        reactionTypes: ["👍", "❤️", "😂", "🙏"],
        userReactions: {}, // Track the selected reaction per post
        showReactionMenu: null, // Track which post's reaction menu is visible
        holdTimeout: null, // Timer for press-and-hold
        loggedInUserId: null, // Track the logged-in user's ID
      };
    },
    async created() {
      await this.fetchUserData(); // Load user ID first
      await this.fetchPosts();
    },
    methods: {
      async fetchUserData() {
        try {
          const authToken = Cookies.get("auth_token");
          if (!authToken) throw new Error("Authentication token missing.");
  
          const response = await fetch("/api/user", {
            method: "GET",
             headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
          });
  
          if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  
          const data = await response.json();
          if (!data.success) throw new Error("Invalid API response format");
  
          this.loggedInUserId = data.user.id;
        } catch (err) {
          console.error("❌ Failed to fetch user data:", err);
          this.error = "Failed to load user data. Please refresh.";
        }
      },
  
      async fetchPosts() {
        this.loading = true;
        try {
          const authToken = Cookies.get("auth_token");
          if (!authToken) throw new Error("Authentication token missing.");
  
          const response = await fetch("/api/user/found-posts", {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
          });
  
          const data = await response.json();
          if (!data.success) throw new Error(data.message);
  
          // Ensure content is properly parsed
          this.posts = data.posts.map(post => ({
            ...post,
            content: this.parseContent(post.content), // ✅ Parse content safely
          }));
        } catch (err) {
          this.error = err.message || "Failed to load posts.";
        } finally {
          this.loading = false;
        }
      },
  
      // ✅ Safely parse JSON content
      parseContent(content) {
        try {
          return typeof content === "string" ? JSON.parse(content) : content;
        } catch (error) {
          console.error("❌ Error parsing post content:", error);
          return { title: "Error loading content", arguments: [] }; // Return a safe fallback
        }
      },
  
      // ✅ Format Bible verse display
      formatVerse(verse) {
        if (!verse || !verse.book) return "No verse selected";
        return `${verse.book} ${verse.chapter}:${verse.number} - "${verse.text}"`;
      },
  
      // ✅ Fix: Retrieve the correct image URL
      getImageUrl(post) {
        return post.photoUrl || null;
      },
  
      async addReaction(post, reactionType) {
        const authToken = Cookies.get("auth_token");
        const previousReaction = this.userReactions[post.id]; // Store the old reaction
        this.userReactions[post.id] = reactionType;
  
        try {
          const response = await fetch("/api/posts/reactions", {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ postId: post.id, reactionType }),
          });
  
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || "Reaction update failed");
          }
  
          
        } catch (error) {
          console.error("❌ Failed to update reaction:", error);
          this.userReactions[post.id] = previousReaction; // Revert UI if API fails
          await this.fetchPosts();
        }
      },
  
      startHold(postId) {
        this.holdTimeout = setTimeout(() => {
          this.showReactionMenu = postId;
        }, 500); // Hold for 500ms to show reaction menu
      },
  
      stopHold() {
        clearTimeout(this.holdTimeout);
      },
      getStatusClass(status) {
        switch (status) {
          case 'found':
            return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
          case 'unclaimed':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
          case 'returned':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
      },
    },
  };
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
  