<script setup>
const items = [
  {
    title: "I Found Tefilin",
    link: "/found",
    img: "/img/t1.jpeg",
    position: "center top",
  },
  {
    title: "I Lost Tefilin",
    link: "/lost",
    img: "/img/t1.jpeg",
    position: "right center",
  },
  {
    title: "Unclaimed Tefilin",
    link: "/search",
    img: "/img/t1.jpeg",
    position: "right top",
  },
  {
    title: "Order Tefilin Tags",
    link: "/for-organizations",
    img: "/img/t1.jpeg",
    position: "center center",
  },
]
</script>

<template>
  <div
    class="flex flex-wrap w-full bg-white text-[#373a3c] text-base leading-6 font-sans overflow-hidden"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      class="relative min-h-[1px] w-full sm:w-1/2 lg:w-1/4 flex-grow-0 flex-shrink-0 my-[10px] px-2 sm:px-[5px]"
    >
      <NuxtLink :to="item.link" class="block">
        <!-- Image background -->
        <div
          class="h-[275px] bg-cover bg-no-repeat w-full"
          :style="{
            backgroundImage: `url(${item.img})`,
            backgroundPosition: item.position,
          }"
        ></div>

        <!-- Title -->
        <div
          class="bg-black text-white font-bold px-[15px] py-[10px] no-underline"
        >
          <span class="uppercase">
            {{ item.title }}
            <span class="text-[21px] leading-[0px] ml-1">»</span>
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
