<template>
  <div class="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-8">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Unclaimed Tefilin Admin</h2>

    <!-- Image Upload & Assign -->
    <section class="border rounded p-4 bg-gray-50 dark:bg-gray-800">
      <h3 class="text-xl font-semibold mb-4">Upload & Assign Images</h3>

      <form @submit.prevent="uploadImage">
        <label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300" for="imageNumber">
          Image Number (ID) to assign / replace
        </label>
        <input
          v-model.number="imageNumber"
          type="number"
          id="imageNumber"
          min="1"
          required
          class="w-24 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <label class="block mt-4 mb-2 font-semibold text-gray-700 dark:text-gray-300" for="imageFile">
          Choose Image
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          @change="onFileChange"
          required
          class="mb-4"
        />

        <button
          type="submit"
          :disabled="!selectedFile || uploading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {{ uploading ? 'Uploading...' : 'Upload & Assign' }}
        </button>
      </form>

      <div v-if="uploadSuccess" class="mt-4 text-green-600 dark:text-green-400 font-semibold">
        Image uploaded and assigned successfully!
      </div>

      <div v-if="uploadError" class="mt-4 text-red-600 dark:text-red-400 font-semibold">
        {{ uploadError }}
      </div>
    </section>

    <!-- Unclaimed Tefilin List -->
    <section>
      <h3 class="text-xl font-semibold mb-4">Unclaimed Tefilin</h3>

      <div v-if="loading" class="text-gray-600 dark:text-gray-300">Loading unclaimed tefilin...</div>
      <div v-else-if="unclaimed.length === 0" class="text-gray-500 dark:text-gray-400">No unclaimed tefilin found.</div>

      <div v-else class="space-y-4">
        <div
          v-for="item in unclaimed"
          :key="item.id"
          class="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <div class="w-24 h-24 flex-shrink-0 mr-6">
            <img
              v-if="images[item.imageNumber]"
              :src="images[item.imageNumber]"
              alt="Tefillin Image"
              class="w-full h-full object-cover rounded"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
            >
              No Image
            </div>
          </div>

          <div class="flex-1">
            <p><strong>ID Tag:</strong> {{ item.idTag }}</p>
            <p><strong>Status:</strong> {{ item.status }}</p>
            <p><strong>Assigned Image Number:</strong> {{ item.imageNumber || 'None' }}</p>
          </div>

          <button
            class="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            @click="claimTefillin(item.id)"
          >
            Claim
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const unclaimed = ref([])
const images = reactive({}) // Key: imageNumber, Value: image URL
const loading = ref(false)

const imageNumber = ref(null)
const selectedFile = ref(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(null)

// Fetch unclaimed tefilin and assigned images on mount
async function fetchUnclaimedTefilin() {
  loading.value = true
  try {
    // Fetch unclaimed tefilin from your API
    // Example:
    // const res = await fetch('/api/tefilin/unclaimed')
    // const data = await res.json()
    // unclaimed.value = data.unclaimedTefilin

    // Placeholder mock data
    unclaimed.value = [
      { id: 1, idTag: 'TF123', status: 'unclaimed', imageNumber: 1 },
      { id: 2, idTag: 'TF124', status: 'unclaimed', imageNumber: 2 },
      { id: 3, idTag: 'TF125', status: 'unclaimed', imageNumber: null },
    ]

    // Fetch images assigned by imageNumber
    // This could be another API call returning image URLs keyed by number
    // Example:
    // const imagesRes = await fetch('/api/tefilin/images')
    // const imagesData = await imagesRes.json()
    // Object.assign(images, imagesData.images)

    // Placeholder images URLs for demo
    images[1] = 'https://via.placeholder.com/96x96.png?text=Image+1'
    images[2] = 'https://via.placeholder.com/96x96.png?text=Image+2'
  } catch (error) {
    console.error('Error fetching unclaimed tefilin:', error)
  } finally {
    loading.value = false
  }
}

// Handle file selection
function onFileChange(e) {
  uploadError.value = null
  uploadSuccess.value = false
  const files = e.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
  }
}

// Upload image & assign it to the imageNumber
async function uploadImage() {
  if (!selectedFile.value || !imageNumber.value) return
  uploading.value = true
  uploadError.value = null
  uploadSuccess.value = false

  try {
    // Replace with your real upload logic (e.g. upload to S3 or server)
    // Here's a dummy timeout to simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // After upload, get the URL of the uploaded image, e.g.:
    // const uploadedUrl = await yourUploadFunction(selectedFile.value)

    // For demo, use local object URL
    const uploadedUrl = URL.createObjectURL(selectedFile.value)

    // Assign/replace the image URL in your images object keyed by imageNumber
    images[imageNumber.value] = uploadedUrl

    uploadSuccess.value = true
    selectedFile.value = null
    imageNumber.value = null
  } catch (err) {
    console.error('Upload failed:', err)
    uploadError.value = 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

// Example claim action
function claimTefillin(id) {
  alert(`Claiming tefilin with ID: ${id}`)
  // Add your claim logic here, like an API call to update status
}

onMounted(fetchUnclaimedTefilin)
</script>

<style scoped>
/* Optional: Add styling for scroll, buttons, etc. */
</style>
