<template>
  <div class="mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
      Found Tefillin Report
    </h2>

    <form @submit.prevent="handleIdCheck" class="space-y-6">
  <!-- Step 1: ID Input -->
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

  <!-- Check Button -->
  <button
    type="submit"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
    :disabled="loading"
  >
    🔍 Check ID
  </button>

  
  <!-- Step 2a: If matched, show form anyway -->
    <div v-if="idMatched">
      <p class="text-center text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
        ✅ This ID is registered. Submitting will update its status to <strong>"found"</strong>.
      </p>
      <!-- Reuse the form -->
      <div>
        <!-- Photo Upload -->
        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Photo:</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full text-gray-800 dark:text-white"
          />
          <p v-if="fileError" class="text-red-500 text-sm mt-1">Please attach a photo.</p>
        </div>

        <!-- Location -->
        <div class="mt-4">
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Where did you find the tefillin bag?
          </label>
          <textarea
            v-model="location"
            rows="4"
            placeholder="Brief description of where it was found..."
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Submit -->
        <button
          type="button"
          class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          @click="handleSubmit"
          :disabled="loading"
        >
          📩 Submit
        </button>
      </div>
    </div>


  <!-- Step 2b: Full Form if not matched -->
  <div v-else-if="showForm">
    <!-- Photo Upload -->
    <div>
      <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Photo:</label>
      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
        class="w-full text-gray-800 dark:text-white"
      />
      <p v-if="fileError" class="text-red-500 text-sm mt-1">Please attach a photo.</p>
    </div>

    <!-- Location -->
    <div>
      <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
        Where did you find the tefillin bag?
      </label>
      <textarea
        v-model="location"
        rows="4"
        placeholder="Brief description of where it was found..."
        class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <!-- Final Submit -->
    <button
      type="button"
      class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
      @click="handleSubmit"
      :disabled="loading"
    >
      📩 Submit
    </button>
  </div>

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

const idMatched = ref(false)
const showForm = ref(false)

const authToken = useCookie('auth_token')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
  fileError.value = !file.value
}

const handleSubmit = async () => {
  // Reset errors and state
  idError.value = idCode.value.length !== 7 || !/^\d{7}$/.test(idCode.value)
  fileError.value = !file.value
  success.value = false

  if (idError.value || fileError.value) return

  loading.value = true

  try {
    // 1. Upload photo
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
    if (!uploadRes.ok || !uploadData?.photo?.id) throw new Error('Photo upload failed')

    const photoId = uploadData.photo.id

    // 2. Submit found post
    const postRes = await fetch('/api/found-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken.value}`,
      },
      body: JSON.stringify({
        type: 'found-tefillin',
        content: {
          idCode: idCode.value,
          location: location.value,
          photoId,
          status: 'foundButLost',
        },
      }),
    })

    const response = await postRes.json()
    if (!postRes.ok || !response.success) throw new Error(response.message || 'Post creation failed')

    // 3. Notify user
    success.value = true
    if (response.updated) {
      alert('✅ This Tefillin was already registered. The status has been updated to "found".')
    } else {
      alert('✅ Found report submitted.')
    }

    // ✅ 4. Register the Tefillin if not already in the database
    if (!idMatched.value) {
      const regRes = await fetch('/api/tefillin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken.value}`,
        },
        body: JSON.stringify({
          idTag: idCode.value,
          qrAttached: false,
          description: `Auto-registered by found report on ${new Date().toLocaleDateString()}`,
          photoUrl: uploadData.photo.url,
          status: 'foundButLost', // ✅ Add this here
        }),
      })

      const regData = await regRes.json()
      if (!regRes.ok || !regData.success) {
        console.warn('⚠️ Registration after found failed:', regData.message)
      } else {
        console.log('✅ Auto-registered tefillin:', regData.tefillin.id)
      }
    }


    // 5. Reset form
    idCode.value = ''
    location.value = ''
    file.value = null
  } catch (err) {
    console.error('❌ Submit error:', err)
    alert(err.message || 'Submission failed. Please try again.')
  } finally {
    loading.value = false
  }
}


const handleIdCheck = async () => {
  idError.value = idCode.value.length !== 7 || !/^\d{7}$/.test(idCode.value)
  if (idError.value) return

  loading.value = true
  try {
    const res = await fetch(`/api/registered-tefillin/lookup?idTag=${idCode.value}`)
    const data = await res.json()

    if (res.ok && data?.found) {
      idMatched.value = true
      showForm.value = false
    } else {
      idMatched.value = false
      showForm.value = true
    }
  } catch (err) {
    console.error('Lookup failed:', err)
    showForm.value = true // fallback to form if error
  } finally {
    loading.value = false
  }
}


</script>
