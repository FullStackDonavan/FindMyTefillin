<template>
  <div
    class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 animate-pulse mx-auto"
  >
    <!-- Image Skeleton -->
    <div class="mb-3">
      <div class="w-full h-64 bg-gray-800 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600"></div>
    </div>


    <!-- Horizontal details skeleton -->
    <div
      class="flex justify-evenly items-center text-gray-700 dark:text-gray-200 w-full overflow-x-auto gap-x-6"
    >
      
    </div>

    <!-- Status & Registered date with border top -->
    <div
      class="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4"
    >
      <div class="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>

    
  </div>
</template>

<script>
export default {
  // No props needed for now
};
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
