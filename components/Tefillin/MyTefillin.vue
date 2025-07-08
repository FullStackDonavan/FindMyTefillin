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

        <div class="text-gray-800 dark:text-gray-100 space-y-1">
          <p><span class="font-semibold">🆔 ID Tag:</span> {{ item.idTag }}</p>
          <p><span class="font-semibold">🔖 QR Attached:</span> {{ item.qrAttached ? 'Yes' : 'No' }}</p>
          <p v-if="item.description"><span class="font-semibold">📝 Description:</span> {{ item.description }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">🕒 Registered on {{ formatDate(item.createdAt) }}</p>
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
