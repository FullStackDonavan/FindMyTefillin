<template>
  <div
    class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 animate-pulse"
  >
    <!-- Tag & Type -->
    <div class="flex justify-between items-center mb-4">
      <div class="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>

    <!-- Description -->
    <div class="mb-3">
      <div class="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div class="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>

    <!-- Location -->
    <div class="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>

    <!-- Footer -->
    <div class="flex justify-end">
      <div class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
</template>

<script setup>
// No props needed
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
