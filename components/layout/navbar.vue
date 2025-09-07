<script setup lang="ts">
// import { userLogout } from "~/composables/useAuth";

// import { ref } from "@vue/reactivity";

// import { onClickOutside } from "@vueuse/core";

// const hideActions = ref(true);
// const userActions = ref(null);

// onClickOutside(userActions, () => (hideActions.value = true));
</script>

<template>
  <MenuContainer>
    <MobileMenuContainer>
      <MobileMenuButton />
      <ClickableLogo /> <span class="sm:hidden text-[#d8d8d8] text-sm italic" style="font-family: &quot;Open Sans&quot;;">the tefilin registry</span>
    </MobileMenuContainer>
    <MenuList />
    <IconList />
  </MenuContainer>
</template>
