<template>
  <PatternSection>
    <div>
        <!-- Full-Width Box -->
        <div class="bg-white dark:bg-gray-800 border-b border-gray-300">
          <div class="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 relative z-10">
            <!-- Profile Header -->
            <div class="flex items-center space-x-6">
              <!-- Avatar -->
              <div class="relative">
                <img
                    :src="loggedInUser?.avatar || 'https://placehold.co/500x500'"
                    alt="Profile Avatar"
                    class="w-48 h-48 rounded-full border-4 border-white dark:border-gray-800 -mt-16 mx-auto"
                  />
                  

                <!-- Camera Icon for Cover Image -->
                <label
                  for="avatar-upload"
                  class="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md"
                  title="Upload Avatar"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>

                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange('avatar', $event)"
                />
                  
                
              </div>
              <!-- Name and Title -->
              <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {{ loggedInUser?.firstName }} {{ loggedInUser?.lastName }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">{{ loggedInUser?.role || 'User' }}</p>
              </div>
            </div>
          </div>
          
        </div>

      
        <div class="max-w-8xl mx-auto p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start transition-all duration-500 ease-in-out">

            <Transition name="slide-aside">
              <aside
                v-if="tab !== 'live' && tab !== 'debate'"
                class="md:col-span-1 transition-all duration-500 ease-in-out"
              >
              <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <!-- Edit Form -->
                <div v-if="editing" class="mt-6">
                  <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Edit Profile</h2>
                  <form @submit.prevent="updateLoggedInUser">
                    <div class="space-y-4">
                      <div>
                        <label for="firstName" class="block text-gray-700 dark:text-gray-300">First Name:</label>
                        <input
                          id="firstName"
                          v-model="loggedInUser.firstName"
                          type="text"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label for="lastName" class="block text-gray-700 dark:text-gray-300">Last Name:</label>
                        <input
                          id="lastName"
                          v-model="loggedInUser.lastName"
                          type="text"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label for="email" class="block text-gray-700 dark:text-gray-300">Email:</label>
                        <input
                          id="email"
                          v-model="loggedInUser.email"
                          type="email"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label for="phone" class="block text-gray-700 dark:text-gray-300">Phone:</label>
                        <input
                          id="phone"
                          v-model="loggedInUser.phone"
                          type="tel"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label for="location" class="block text-gray-700 dark:text-gray-300">Location:</label>
                        <input
                          id="location"
                          v-model="loggedInUser.location"
                          type="text"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label for="bio" class="block text-gray-700 dark:text-gray-300">Bio:</label>
                        <textarea
                          id="bio"
                          v-model="loggedInUser.bio"
                          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                      </div>
                    </div>
                    <div class="mt-4 flex justify-end space-x-4">
                      <button
                        type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                        @click="cancelEdit"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Personal Info -->
                <div v-else>
                  <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Intro</h2>
                  <ul class="space-y-4">
                    <li class="flex justify-between">
                      <span class="text-gray-700 dark:text-gray-300">Email:</span>
                      <span class="text-gray-800 dark:text-gray-200">{{ loggedInUser?.email }}</span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-gray-700 dark:text-gray-300">Phone:</span>
                      <span class="text-gray-800 dark:text-gray-200">{{ loggedInUser?.phone || 'N/A' }}</span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-gray-700 dark:text-gray-300">Location:</span>
                      <span class="text-gray-800 dark:text-gray-200">{{ loggedInUser?.location || 'N/A' }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Edit and Logout Buttons -->
                <div class="mt-6 flex justify-between">
                  <button
                    class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 w-full"
                    @click="editProfile"
                  >
                    Edit Details
                  </button>

                  <!-- <button
                    class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                    @click="logout"
                  >
                    Logout
                  </button> -->
                </div>
              </div>


          






              



            </aside>
          </Transition>

         
         
            <!-- Section Column -->
            <Transition name="slide-aside">
            <section
              class="transition-all duration-500 ease-in-out"
              :class="(tab === 'live' || tab === 'debate') ? 'md:col-span-3' : 'md:col-span-2'"
            >
              <!-- Tabs -->
              <div class="border-b border-gray-300 dark:border-gray-600 mb-4">
                <ul class="flex space-x-4 bg-white dark:bg-gray-800 p-4 shadow-md">
                  <li
                    :class="tab === 'register' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('register')"
                  >
                    Register
                  </li>
                  <li
                    :class="tab === 'my' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('my')"
                  >
                    My Tefillin
                  </li>
                  <li
                    :class="tab === 'order' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('order')"
                  >
                    Order
                  </li>
                  <li
                    :class="tab === 'myOrders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('myOrders')"
                  >
                    My Orders
                  </li>
                  <li
                    :class="tab === 'allOrders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('allOrders')"
                  >
                    All Orders
                  </li>
                  <li
                    :class="tab === 'lost' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('lost')"
                  >
                    Lost
                  </li>
                  <li
                    :class="tab === 'found' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('found')"
                  >
                    Found
                  </li>
                  <li
                    :class="tab === 'unclaimed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'"
                    class="cursor-pointer pb-2"
                    @click="setTab('unclaimed')"
                  >
                    Unclaimed Admin
                  </li>
                </ul>
              </div>

              <!-- Tab Content -->
              <div>

                
                <!-- Register Your Tefillin Tab -->
                <div v-if="tab === 'register'" class="">
                  <RegisterYourTefillin />
                </div>

                <!-- My Tefillin Tab -->
                <div v-if="tab === 'my'" class="">
                  <MyTefillin />
                </div>

                <!-- My Order Tab -->
                <div v-if="tab === 'order'" class="">
                  <CustomOrderForm />
                </div>

                <!-- My Orders Tab -->
                <div v-if="tab === 'myOrders'" class="">
                  <MyOrders />
                </div>

                <!-- All Orders Tab -->
                <div v-if="tab === 'allOrders'" class="">
                  <AllOrders />
                </div>

                
                <!-- Lost Tab -->
                <div v-if="tab === 'lost'" class="">
                  <LostTefillinForm />
                  <LostFeed />
                </div>

                <!-- Found Tab -->
                <div v-if="tab === 'found'" class="">
                  <FoundTefillinForm />
                  <Feed />
                </div>

                <!-- UnclaimedTefilinAdmin Tab -->
                <div v-if="tab === 'unclaimed'" class="">
                  <UnclaimedTefilinAdmin />
                  <Feed />
                </div>

              </div>
            </section>
          </Transition>
          </div>
        </div>
    </div>
  </PatternSection>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUser, userLogout, useAuthCookie } from '~/composables/useAuth'
import Cookies from 'js-cookie'

// Data & State
const loggedInUser = ref(null)
const defaultCoverImage = 'https://placehold.co/2000x500'
const editing = ref(false)
const tab = ref('my')


// Get the reactive auth cookie
const authCookie = useAuthCookie()

// Watch for changes to the auth cookie and re-fetch user data
watch(
  () => authCookie.value,
  (newVal, oldVal) => {
    console.log('Auth cookie changed from', oldVal, 'to', newVal)
    if (newVal) {
      // When a new token is set, re-fetch the user data
      getLoggedInUser().then(data => {
        loggedInUser.value = data
      })
    } 
  }
)

// Methods (as functions)
async function getLoggedInUser() {
  try {
    if (!authCookie.value) {
      console.error("Auth cookie is missing.");
      return null;
    }
    console.log("Fetching fresh user data...");
    
    const response = await $fetch(`/api/user`, {
      headers: { Authorization: `Bearer ${authCookie.value}` },
    });

    console.log("✅ User fetched:", response);
    
    // **Check response format and return correct object**
    return response.user || response; // ✅ Handles both old & new API formats
  } catch (error) {
    console.error("Error in getLoggedInUser:", error.message || error);
    return null;
  }
}



async function updateLoggedInUser() {
  try {
    const token = Cookies.get('auth_token')
    if (!token) throw new Error('Authentication token is missing.')
    await $fetch('/api/user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: loggedInUser.value,
    })
    alert('Profile updated successfully!')
    editing.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  }
}

function editProfile() {
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function handleFileChange(type, event) {
  const file = event.target.files[0]
  if (!file) {
    alert('No file selected.')
    return
  }
  const formData = new FormData()
  formData.append(type, file)
  try {
    if (!authCookie.value) throw new Error('Authentication token is missing.')
    await $fetch('/api/user/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
      body: formData,
    })
    alert(`${type === 'cover' ? 'Cover image' : 'Profile image'} uploaded successfully.`)
    loggedInUser.value = await getLoggedInUser()
  } catch (error) {
    console.error(`Error uploading ${type}:`, error)
    alert(`Failed to upload ${type}. Please try again.`)
  }
}

async function setTab(tabName) {
  tab.value = tabName
  console.log('Switching tab to:', tabName)
  if (tabName === 'highlights') {
    await fetchHighlights()
  } else if (tabName === 'notes') {
    await fetchNotes()
  } else if (tabName === 'places') {
    await fetchPlaces()
  }
}

async function logout() {
  await userLogout()
}










onMounted(async () => {
  if (!authCookie.value) {
    console.log("❌ No auth token found.");
    return;
  }

  console.log("✅ Fetching user...");
  loggedInUser.value = await getLoggedInUser();


});



</script>

<style lang="css" scoped>
/* Sidebar slide */
.slide-aside-enter-active,
.slide-aside-leave-active {
  transition: all 0.5s ease;
}
.slide-aside-enter-from,
.slide-aside-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-aside-enter-to,
.slide-aside-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Main section grows */
.grow-section {
  transition: all 0.5s ease;
}




</style>