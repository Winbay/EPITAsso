<script setup>
import { ref } from "vue";
import Avatar from "primevue/avatar";

const items = ref([
  {
    icon: "pi pi-bars"
  }
])

function stateMenu() {
  let sidePanel = document.getElementById("side-panel");
  let classAdd, classRemove;
  if (sidePanel.classList.contains("absolute")) {
    sidePanel.classList.remove("-left-56");
    sidePanel.classList.add("left-0");
    setTimeout(() => {
      sidePanel.classList.remove("absolute");
      sidePanel.classList.add("static");
    }, 800);
    classAdd = ["static", "left-0"];
    classRemove = ["absolute", "-left-56"];
  } else {
    ["static", "left-0"].forEach((className) => sidePanel.classList.remove(className));
    ["absolute", "-left-56"].forEach((className) => sidePanel.classList.add(className));
  }
}
</script>

<template>
  <header class="w-full h-10 flex justify-between">
    <div class="header-left w-64 flex justify-between items-center">
      <div class="page-title w-56 flex justify-center">
        <span class="ml-2 text-lg font-bold uppercase text-wrap">Panel Association</span>
      </div>
      <div class="btn-menu flex justify-center cursor-pointer" v-on:click="stateMenu">
        <i class="pi pi-bars" style="font-size: 1.5rem;"/>
      </div>
    </div>
    <div class="header-right flex justify-center items-center mr-10">
      <Avatar image="/images/eptv.jpg" class="mr-2" shape="circle"/>
      <span class="ml-2 text-base font-semibold">Association</span>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--primary-color);
}
</style>