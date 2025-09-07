<template>
  <main>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Heading -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Search All Lost and Found Items
        </h1>
        <p class="text-lg text-gray-600 dark:text-white">
          Search our registry by MyTefilinTag™ ID or browse all lost and found vouchers.
        </p>
      </div>

      <!-- Search Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <form class="space-y-6" @submit.prevent="onSearch">
          <!-- Tag Input -->
          <div>
            <label
              for="tagId"
              class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
            >
              MyTefilinTag™ ID (Optional)
            </label>
            <div class="flex gap-4">
              <input
                id="tagId"
                v-model="query"
                placeholder="Enter Tag ID or leave blank to browse all"
                class="flex-1 px-4 py-2 dark:bg-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-lg"
                type="text"
              />
              <button
                :disabled="loading"
                type="submit"
                class="whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 shadow-xs hover:bg-primary/90 h-9 bg-black text-white font-semibold px-8 py-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  v-if="!loading"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-search"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <span>{{ loading ? "Searching..." : "Search" }}</span>
              </button>
            </div>
          </div>

            <!-- Filters -->
            <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Filter by Type</h3>
            <div class="flex flex-wrap gap-3">
                <label
                v-for="option in [
                    { id: 'filter_all', label: 'All', value: 'all' },
                    { id: 'filter_lost', label: 'Lost', value: 'lost' },
                    { id: 'filter_found', label: 'Found', value: 'found' }
                ]"
                :key="option.id"
                class="cursor-pointer"
                >
                <input
                    type="radio"
                    class="peer hidden"
                    name="filter"
                    :id="option.id"
                    v-model="filter"
                    :value="option.value"
                />
                <span
                    class="px-4 py-2 text-sm font-medium rounded-lg border shadow-sm
                        bg-white dark:bg-gray-700 dark:border-gray-600
                        text-gray-700 dark:text-gray-300
                        peer-checked:bg-black peer-checked:text-white peer-checked:border-black
                        transition-colors duration-200"
                >
                    {{ option.label }}
                </span>
                </label>
            </div>
            </div>

        </form>
      </div>

      <!-- Results -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-white text-xl font-semibold text-gray-800 mb-4">
          Search Results
          <span v-if="loading" class="text-sm font-normal text-gray-500 ml-2">
            Loading...
          </span>
        </h2>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
          <p class="mt-4 text-gray-600 dark:text-white font-medium">Loading results...</p>
        </div>

        <!-- Results -->
        <div v-else>
        <div v-if="results.length" class="grid gap-6 md:grid-cols-2">
        <div
            v-for="(item, index) in results"
            :key="index"
            class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ item.tagId || "Unknown Tag" }}
            </h3>
            <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="item.type === 'lost'
                ? 'bg-red-100 text-red-600'
                : item.type === 'found'
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-600'"
            >
                {{ item.type }}
            </span>
            </div>

            <!-- Body -->
            <p class="text-gray-700 dark:text-gray-300 mb-2">
            {{ item.description || "No description available" }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
            Location: {{ item.location || "Unknown" }}
            </p>

            <!-- Footer -->
            <div class="mt-4 flex justify-end">
            <button
                class="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
                View Details
            </button>
            </div>
        </div>
        </div>

          <p v-else class="text-gray-600 dark:text-white">No results found.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"

const query = ref("")
const filter = ref("all")
const results = ref([])
const loading = ref(false)

const onSearch = async () => {
  loading.value = true
  try {
    const { data } = await useFetch("/api/search/lost-found", {
      params: { q: query.value, filter: filter.value },
    })
    results.value = data.value || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onSearch()
})

// Watch filter changes
watch(filter, () => {
  onSearch()
})
</script>
