<template>
  <div class="mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">ORDER CUSTOM findmytefilin.com tags</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-300">All orders are shipped free of charge to any address in USA</p>

    <div class="flex justify-center space-x-4 mb-6">
      <button
        :class="[
          'px-4 py-2 rounded font-semibold',
          selectedCategory === 'single'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
        ]"
        @click="selectedCategory = 'single'"
      >
        Single
      </button>
      <button
        :class="[
          'px-4 py-2 rounded font-semibold',
          selectedCategory === 'family'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
        ]"
        @click="selectedCategory = 'family'"
      >
        Family
      </button>
    </div>


    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Single Tags -->
      <div v-if="selectedCategory === 'single'">
        <div>
          <h3 class="font-semibold mb-4 text-gray-800 dark:text-gray-200">Single Tags</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(item, index) in singleItems"
              :key="'single-' + index"
              class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between"
            >
              <p class="mb-4 text-gray-700 dark:text-gray-300">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  v-model.number="item.qty"
                  class="w-20 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
                />
                <span class="font-semibold text-gray-900 dark:text-white">${{ item.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Packages -->
       <div v-if="selectedCategory === 'family'">
        <div>
          <h3 class="font-semibold mb-4 text-gray-800 dark:text-gray-200">Family Packages</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(item, index) in familyItems"
              :key="'family-' + index"
              class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between"
            >
              <p class="mb-4 text-gray-700 dark:text-gray-300">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  v-model.number="item.qty"
                  class="w-20 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
                />
                <span class="font-semibold text-gray-900 dark:text-white">${{ item.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="text-right font-bold text-xl text-gray-800 dark:text-white">
        Total: ${{ total.toFixed(2) }}
      </div>

      <!-- Shipping Info -->
      <fieldset class="border border-gray-300 dark:border-gray-700 rounded p-4 space-y-4">
        <legend class="font-semibold text-lg text-gray-800 dark:text-white">Shipping Information</legend>

        <input
          v-model="shipping.name"
          type="text"
          placeholder="Full Name"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.address"
          type="text"
          placeholder="Address"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.city"
          type="text"
          placeholder="City"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.state"
          type="text"
          placeholder="State"
          maxlength="2"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.zip"
          type="text"
          placeholder="Zip Code"
          pattern="\d{5}"
          title="Please enter a 5-digit zip code"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.phone"
          type="tel"
          placeholder="Phone Number"
          pattern="\d{10}"
          title="Please enter a 10-digit phone number"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="shipping.email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </fieldset>

      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded mt-4 disabled:opacity-50"
        :disabled="submitting || total === 0"
      >
        {{ submitting ? 'Redirecting to payment...' : 'Proceed to Payment' }}
      </button>

      <p v-if="errorMessage" class="mt-4 text-red-600 font-semibold">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useAuthCookie, useUser } from '~/composables/useAuth'

const singleItems = reactive([
  {
    description: '1 Custom zipper tag with QR code and your unique ID Code',
    price: 9.99,
    qty: 0,
  },
  {
    description: '1 Custom zipper tags with QR code and your unique ID Code plus 1 airtag holder with QR code and your unique ID Code',
    price: 19.99,
    qty: 0,
  },
  {
    description: '1 Custom zipper tags with QR code and your unique ID Code plus 1 airtag holder (including apple airtag) with QR code and your unique ID Code',
    price: 44.99,
    qty: 0,
  },
])

const familyItems = reactive([
  {
    description: '3 Custom zipper tags with unique QR codes and ID Codes',
    price: 19.99,
    qty: 0,
  },
  {
    description: '3 Custom zipper tags with QR code and your unique ID Code plus 1 airtag holder with QR code and your unique ID Code',
    price: 29.99,
    qty: 0,
  },
  {
    description: '3 Custom zipper tags with QR code and your unique ID Code plus 1 airtag holder (including apple airtag) with QR code and your unique ID Code',
    price: 99.99,
    qty: 0,
  },
])

const shipping = reactive({
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
})

const submitting = ref(false)
const errorMessage = ref('')

const selectedCategory = ref('single')


const total = computed(() => {
  const singleTotal = singleItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const familyTotal = familyItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  return singleTotal + familyTotal
})

async function handleSubmit() {
  errorMessage.value = ''

  if (total.value === 0) {
    errorMessage.value = 'Please select at least one item to order.'
    return
  }

  submitting.value = true

  try {
    const orderData = {
      items: [...singleItems, ...familyItems]
        .filter(i => i.qty > 0)
        .map(i => ({ description: i.description, qty: i.qty, price: i.price })),
      shipping: { ...shipping },
      total: total.value,
    }

    const authCookie = useAuthCookie().value 
    console.log('Order data being sent to server:', orderData)


    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCookie}`,
      },
      body: JSON.stringify(orderData),
    })

    const data = await response.json()
    console.log('Stripe checkout response:', data)

    if (data.error) throw new Error(data.error)
    if (!data.url) throw new Error('No checkout URL returned by server')

    window.location.href = data.url
  } catch (err) {
    errorMessage.value = err.message || 'Failed to start payment.'
    submitting.value = false
  }
}

</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
