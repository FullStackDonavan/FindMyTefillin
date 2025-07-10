<template>
  <div class="mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Orders</h2>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Loading orders...</div>
    <div v-if="error" class="text-red-600 font-medium">{{ error }}</div>

    <div v-if="orders.length">
      <div
        v-for="order in orders"
        :key="order.id"
        class="mb-6 p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Order #{{ order.id }}
          </h3>
          <span
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-800': order.status === 'pending',
              'bg-green-100 text-green-800': order.status === 'paid',
              'bg-blue-100 text-blue-800': order.status === 'shipped',
              'bg-gray-100 text-gray-800': order.status === 'cancelled'
            }"
          >
            {{ order.status }}
          </span>
        </div>

        <p class="text-gray-600 dark:text-gray-300 mb-1">
          <strong>Total:</strong> ${{ (order.totalAmount / 100).toFixed(2) }}
        </p>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          <strong>Placed on:</strong> {{ new Date(order.createdAt).toLocaleString() }}
        </p>

        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-2">Items</h4>
          <ul class="space-y-1">
            <li
              v-for="item in order.items"
              :key="item.id"
              class="text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 py-4 mt-2"
            >
              {{ item.description }} — <strong>Qty: {{ item.quantity }} — ${{ (item.unitPrice / 100).toFixed(2) }}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 dark:text-gray-400">No orders found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCookie } from '#app'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchOrders() {
  loading.value = true
  error.value = null
  try {
    const authToken = useCookie('auth_token')
    const res = await fetch('/api/orders/my', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch orders')
    orders.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
