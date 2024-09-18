<script setup lang="ts">
import AssoCarousel from "@/components/Home/AssoCarousel.vue";
import VideoIframe from "@/components/Home/VideoIframe.vue";
import MyAsso from "@/components/Home/Modules/MyAsso.vue";
import UpcomingEvents from "@/components/Home/Modules/UpcomingEvents.vue";
import LargestAssos from "@/components/Home/Modules/LargestAssos.vue";
import CurrentBDE from "@/components/Home/Modules/CurrentBDE.vue";
</script>

<template>
  <main class="py-6">
    <VideoIframe />
    <AssoCarousel />
    <div class="flex justify-center gap-4">
      <div class="modules-left flex flex-col gap-4">
        <MyAsso />
        <UpcomingEvents/>
      </div>
      <div class="modules-right flex flex-col gap-4">
        <LargestAssos />
        <CurrentBDE />
      </div>
    </div>
  </main>
</template>

<style>
main .modules-left {
  width: 50%;
  min-width: 570px;
}

main .modules-right {
  width: 340px;
}
</style>
