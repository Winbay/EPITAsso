<script setup lang="ts">
import SideMenu from "@/components/SideMenu.vue";
import TheHeader from "@/components/TheHeader.vue";
import MainPanel from "@/components/MainPanel.vue";
</script>

<template>
  <TheHeader/>

  <main class="flex main">
    <SideMenu :style="{ zIndex: 1}"/>
    <MainPanel/>
  </main>
</template>

<style scoped>

.main {
  height: max-content;
  background-color: #1f2937;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
