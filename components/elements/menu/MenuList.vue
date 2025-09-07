<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom">
      <!-- Home Link -->
      <nuxt-link to="/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Home
        </span>
      </nuxt-link>

      <!-- Search Lost & Found Link -->
      <nuxt-link to="/search" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/search')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Search Lost & Found
        </span>
      </nuxt-link>

      <!-- Report Found Tefilin Link -->
      <nuxt-link to="/found" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/found')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Report Found Tefilin
        </span>
      </nuxt-link>

      <!-- Report Lost Tefilin Link -->
      <nuxt-link to="/lost" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/lost')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Report Lost Tefilin
        </span>
      </nuxt-link>

      <!-- <nuxt-link to="/profile/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isPortfolioActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Profile
        </span>
      </nuxt-link> -->
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// Function to check if the current route is active or a sub-route
const isActive = (path) => {
  return route.path === path;
};

// Check if the route is '/categories' or '/tags' or their sub-routes
const isPortfolioActive = computed(() => {
  return (
    route.path.startsWith("/categories") ||
    route.path.startsWith("/tags") ||
    route.path.startsWith("/portfolio/")
  );
});
</script>
