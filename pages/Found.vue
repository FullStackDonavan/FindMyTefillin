<template>
  <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
    <h2 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
      🎉 Congratulations!
    </h2>
    <p class="text-gray-700 dark:text-gray-200 mb-6">
      You have found someone's tefillin bag and are one step closer to returning it to its owner and collecting a reward.
    </p>

    <div class="flex flex-wrap justify-center gap-4 mb-6">
      <a href="tel:+15163090958" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
        📞 Call
      </a>
      <a href="https://wa.me/15163090958" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
        💬 WhatsApp
      </a>
      <a href="sms:+15163090958" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
        ✉️ Text
      </a>
    </div>

    <form @submit.prevent="sendEmail" class="text-left">
      <label for="email" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Your Email:</label>
      <input
        v-model="email"
        type="email"
        id="email"
        name="email"
        placeholder="you@example.com"
        required
        class="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label for="message" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Optional Message:</label>
      <textarea
        v-model="message"
        id="message"
        name="message"
        rows="5"
        placeholder="Write a message or location details..."
        class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      ></textarea>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        {{ loading ? 'Sending...' : '📧 Send Email' }}
      </button>
    </form>

    <p v-if="success" class="mt-4 text-green-600 dark:text-green-400 font-medium">
      ✅ Message sent successfully!
    </p>
    <p v-if="error" class="mt-4 text-red-600 dark:text-red-400 font-medium">
      ❌ {{ error }}
    </p>
    <FoundTefillinForm />
                  <Feed />
  </div>
  
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref(null)

const sendEmail = async () => {
  loading.value = true
  success.value = false
  error.value = null

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replyTo: email.value,
        message: message.value,
      }),
    })

    if (!res.ok) throw new Error(await res.text())

    success.value = true
    email.value = ''
    message.value = ''
  } catch (err) {
    error.value = err.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>
