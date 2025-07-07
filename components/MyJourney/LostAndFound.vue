<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
      Find My Tefilin™
    </h2>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <NuxtLink to="/found" class="flex-1 max-w-sm">
        <img
          src="/images/tefilinBag.png"
          alt="Image One"
          class="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </NuxtLink>

      <NuxtLink to="/lost" class="flex-1 max-w-sm">
        <img
          src="/images/tefilinBag.png"
          alt="Image Two"
          class="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </NuxtLink>
    </div>
  </div>
</template>
