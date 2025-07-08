<template>
  <div class="mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">🧳 I Lost My Tefillin</h2>

    <!-- Are they registered? -->
    <div class="mb-4">
      <p class="font-semibold text-gray-700 dark:text-gray-300">Are your tefillin registered on findmytefilin.com?</p>
      <div class="flex space-x-4 mt-2">
        <button @click="registered = true" :class="yesButtonClass(registered)">Yes</button>
        <button @click="registered = false" :class="yesButtonClass(registered === false)">No</button>
      </div>
    </div>

    <!-- If registered, login form -->
    <div v-if="registered === true" class="mb-6">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Login Email:</label>
      <input v-model="loginEmail" type="email" class="form-input mb-2" />
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Password:</label>
      <input v-model="loginPassword" type="password" class="form-input" />
    </div>

    <!-- QR code attached? -->
    <div class="mb-4">
      <p class="font-semibold text-gray-700 dark:text-gray-300">Is your QR code attached to your tefillin bag?</p>
      <div class="flex space-x-4 mt-2">
        <button @click="qrAttached = true" :class="yesButtonClass(qrAttached)">Yes</button>
        <button @click="qrAttached = false" :class="yesButtonClass(qrAttached === false)">No</button>
      </div>
    </div>

    <!-- ID Tag input -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Enter ID Tag number on your bag:</label>
      <input v-model="idTag" type="text" maxlength="7" class="form-input" placeholder="e.g. 1234567" />
    </div>

    <!-- User info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="firstName" class="form-input" placeholder="First Name" />
      <input v-model="lastName" class="form-input" placeholder="Last Name" />
      <input v-model="phone" class="form-input" placeholder="Phone Number" />
      <input v-model="alternatePhone" class="form-input" placeholder="Alternate Contact Number" />
      <input v-model="email" class="form-input md:col-span-2" placeholder="Your Email" />
    </div>

    <!-- Photo Upload -->
    <div class="mt-4">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Attach a photo of your tefillin bag:</label>
      <input type="file" accept="image/*" @change="handleFileChange" />
    </div>

    <!-- Lost location -->
    <div class="mt-4">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Where did you lose them?</label>
      <textarea v-model="location" rows="3" class="form-input w-full"></textarea>
    </div>

    <!-- Submit -->
    <button
      @click="handleSubmit"
      :disabled="loading"
      class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
    >
      📩 Submit
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registered = ref(null)
const qrAttached = ref(null)
const loginEmail = ref('')
const loginPassword = ref('')
const idTag = ref('')

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const alternatePhone = ref('')
const email = ref('')
const file = ref(null)
const location = ref('')

const loading = ref(false)
const authToken = useCookie('auth_token')

const yesButtonClass = (active) =>
  `px-4 py-1 rounded-full border font-medium ${
    active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }`

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleSubmit = async () => {
  loading.value = true

  try {
    let photoId = null

    // 1. Upload photo first (if any)
    if (file.value) {
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
      photoId = uploadData.photo.id
    }

    // 2. Submit Lost Tefillin Report (now with photoId)
    const res = await fetch('/api/lost-tefillin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken.value}`,
      },
      body: JSON.stringify({
        idTag: idTag.value,
        registered: registered.value,
        qrAttached: qrAttached.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        alternatePhone: alternatePhone.value,
        email: email.value,
        location: location.value,
        photoId, // <-- Send this instead of raw photo
      }),
    })

    if (!res.ok) throw new Error(await res.text())
    router.push('/thank-you-lost')
  } catch (err) {
    alert('Submission failed.')
    console.error(err)
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
