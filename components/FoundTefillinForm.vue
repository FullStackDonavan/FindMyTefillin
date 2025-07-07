<template>
  <div class="mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
      🧳 Found Tefillin Report
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- ID Code -->
      <div>
        <label for="idCode" class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
          Enter ID code on the tag:
        </label>
        <input
          v-model="idCode"
          type="text"
          id="idCode"
          maxlength="7"
          placeholder="e.g. 1234567"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="idError" class="text-red-500 text-sm mt-1">Please enter a valid 7-digit code.</p>
      </div>

      <!-- Photo Upload -->
      <div>
        <label for="photo" class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
          Attach Photo:
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          @change="handleFileChange"
          class="w-full text-gray-800 dark:text-white"
        />
        <p v-if="fileError" class="text-red-500 text-sm mt-1">Please attach a photo.</p>
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
          Where did you find the tefillin bag?
        </label>
        <textarea
          v-model="location"
          id="location"
          rows="4"
          placeholder="Brief description of where it was found..."
          class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="loading"
      >
        📩 Submit
      </button>

      <!-- Success -->
      <p v-if="success" class="text-green-600 dark:text-green-400 mt-4 font-medium text-center">
        ✅ Report submitted! 
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCookie } from '#app'

const idCode = ref('')
const location = ref('')
const file = ref(null)

const idError = ref(false)
const fileError = ref(false)
const success = ref(false)
const loading = ref(false)

const authToken = useCookie('auth_token')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
  fileError.value = !file.value
}

const handleSubmit = async () => {
  // Reset errors and success
  idError.value = idCode.value.length !== 7 || !/^\d{7}$/.test(idCode.value)
  fileError.value = !file.value
  success.value = false

  if (idError.value || fileError.value) return

  loading.value = true

  try {
    // Upload the photo first
    const formData = new FormData()
    formData.append('image', file.value)

    const uploadRes = await fetch('/api/photos/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      body: formData,
    })

    const uploadData = await uploadRes.json()
    if (!uploadData?.photo?.id) throw new Error('Photo upload failed')

    const photoId = uploadData.photo.id

    // Submit the found tefillin post with correct shape
    const postRes = await fetch('/api/found-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken.value}`,
      },
      body: JSON.stringify({
        type: 'found-tefillin',  // <-- required by backend
        content: {
          idCode: idCode.value,
          location: location.value,
          photoId,
        }
      }),
    })

    if (!postRes.ok) throw new Error('Post creation failed')

    success.value = true
    idCode.value = ''
    location.value = ''
    file.value = null
  } catch (err) {
    console.error('❌ Submit error:', err)
    alert('Submission failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
