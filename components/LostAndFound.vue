<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
      Find My Tefilin™
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Found Page -->
      <NuxtLink to="/found" class="group block rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-xl transition-all">
        <img
          src="/images/tefilinBag.png"
          alt="Found Tefillin"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="p-4 bg-white dark:bg-gray-800">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white text-center">I Found Tefillin</h2>
        </div>
      </NuxtLink>

      <!-- Lost Page -->
      <NuxtLink to="/lost" class="group block rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-xl transition-all">
        <img
          src="/images/tefilinBag.png"
          alt="Lost Tefillin"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="p-4 bg-white dark:bg-gray-800">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white text-center">I Lost Tefillin</h2>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
