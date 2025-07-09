<template>
  <div class="mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">📘Register My Tefillin</h2>

    <input v-model="idTag" placeholder="ID Tag (e.g. 1234567)" class="form-input mb-3" />
    
    <div class="mb-3">
      <label class="font-semibold text-gray-700 dark:text-gray-300">QR Code Attached?</label>
      <div class="flex space-x-4 mt-1">
        <button @click="qrAttached = true" :class="yesButtonClass(qrAttached)">Yes</button>
        <button @click="qrAttached = false" :class="yesButtonClass(qrAttached === false)">No</button>
      </div>
    </div>

    <textarea v-model="description" rows="3" class="form-input mb-3" placeholder="Describe your tefillin bag (optional)"></textarea>

    <input type="file" accept="image/*" @change="handleFileChange" class="mb-3" />

    <button @click="handleSubmit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
      💾 Submit
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const idTag = ref('')
const qrAttached = ref(null)
const description = ref('')
const file = ref(null)
const loading = ref(false)
const authToken = useCookie('auth_token')

const yesButtonClass = (active) =>
  `px-4 py-1 rounded-full border font-medium ${
    active ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }`

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleSubmit = async () => {
  loading.value = true
  try {
    let uploadedUrl = null
    if (file.value) {
      const formData = new FormData()
      formData.append('image', file.value)

      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken.value}` },
        body: formData,
      })

      const data = await res.json()
      uploadedUrl = data.photo?.url || null
    }

    const registerRes = await fetch('/api/tefillin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken.value}`,
      },
      body: JSON.stringify({
        idTag: idTag.value,
        qrAttached: qrAttached.value,
        description: description.value,
        photoUrl: uploadedUrl,
      }),
    })

    const result = await registerRes.json()
    if (!result.success) throw new Error(result.message)
    alert('Tefillin registered successfully!')
  } catch (err) {
    console.error(err)
    alert('Something went wrong.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
