<template>
  <div class="mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">All Orders</h2>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Loading all orders...</div>
    <div v-if="error" class="text-red-600 font-medium">{{ error }}</div>

    <div v-if="orders.length">
      <div
        v-for="order in orders"
        :key="order.id"
        class="mb-6 p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-100">
              Order #{{ order.id }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">User ID: {{ order.userId }}</p>
          </div>
          <div class="flex items-center gap-2 mt-2 sm:mt-0">
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

            <button
              v-if="order.status !== 'shipped'"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition"
              @click="markAsShipped(order.id)"
            >
              Mark as Shipped
            </button>

            <p
              v-else
              class="text-green-600 text-sm font-semibold"
            >
              ✔ Shipped
            </p>
          </div>
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
              class="text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"
            >
              {{ item.description }} — Qty: {{ item.quantity }} — ${{ (item.unitPrice / 100).toFixed(2) }}
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
import { useAuthCookie } from '~/composables/useAuth'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchAllOrders() {
  loading.value = true
  error.value = null
  try {
    const authCookie = useAuthCookie()
    const res = await fetch('/api/orders/all', {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
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

async function markAsShipped(orderId) {
  try {
    const authCookie = useAuthCookie()
    const res = await fetch('/api/orders/mark-shipped', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCookie.value}`,
      },
      body: JSON.stringify({ orderId }),
    })
    if (!res.ok) throw new Error('Failed to update status')
    await fetchAllOrders()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(() => {
  fetchAllOrders()
})
</script>
