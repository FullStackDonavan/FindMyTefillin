<template>
  <div class="mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📘 My Registered Tefillin</h2>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Loading your tefillin...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="tefillins.length === 0" class="text-gray-500 dark:text-gray-400">You haven’t registered any tefillin yet.</div>

    <div v-else>
      <div
        v-for="item in tefillins"
        :key="item.id"
        class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800"
      >
        <div v-if="item.photoUrl" class="mb-3">
          <img :src="item.photoUrl" alt="Tefillin Photo" class="w-full max-h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
        </div>

        <div class="flex justify-between items-center text-gray-700 dark:text-gray-200 mt-4 w-full overflow-x-auto gap-x-6">
          <div class="flex items-center space-x-1">
            <span class="font-semibold">Tefillin ID:</span>
            <span>{{ item.idTag }}</span>
          </div>

          <div class="flex items-center space-x-1">
            <span class="font-semibold">QR Attached:</span>
            <span>{{ item.qrAttached ? 'Yes' : 'No' }}</span>
          </div>

        </div>
        <div class="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          

          <div class="min-w-fit">
            <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(item.status)">
              {{ item.status || 'unknown' }}
            </span>
          </div>

          

          <div class="min-w-fit flex items-center space-x-1">
            <span class="font-semibold">Registered:</span>
            <span>{{ formatDate(item.createdAt) }}</span>
          </div>

          

          
        </div>


<div v-if="item.status === 'foundButLost' || item.status === 'found'" class="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400 pt-4">
        <div  class="min-w-fit">
            <button
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded whitespace-nowrap"
              @click="payAndConfirm(item.id)"
              :disabled="loadingStatus"
            >
              Claim & Pay to Activate
            </button>
          </div>
</div>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const tefillins = ref([])
const loading = ref(false)
const error = ref(null)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'registered':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'lost':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'returned':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    case 'reported':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
  }
}


onMounted(async () => {
  loading.value = true
  try {
    const token = Cookies.get('auth_token')
    if (!token) throw new Error('Unauthorized')

    const res = await fetch('/api/tefillin/my', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    tefillins.value = data.tefillins
  } catch (err) {
    console.error('❌ Failed to load tefillin:', err)
    error.value = err.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
