<script setup lang="ts">
import { ref } from "vue";

const initalCheck = await useLoggedIn();
const isLoggedIn = ref(initalCheck);
const user = useState("user");

async function checkIfLoggedIn() {
  const check = await useLoggedIn();
  isLoggedIn.value = check;
}

watch(
  user,
  async () => {
    await checkIfLoggedIn();
  },
  { deep: true }
);
</script>
<template>
  <div class="py-4 overflow-y-auto my-12">
    <ul class="space-y-2">
      <MenuIconList />

      <li>
        <NuxtLink
          to="/"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:house"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="ml-3">Home</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/search"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:house"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="ml-3">Search Lost & Found</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/found"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:house"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="ml-3">Report Found Tefilin</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/lost"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:house"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="ml-3">Report Lost Tefilin</span>
        </NuxtLink>
      </li>




       
    </ul>
  </div>
</template>