<script setup lang="ts">
import {useSingleAssoStore} from "@/stores/singleAsso";
import {useFunctionsStore} from "@/stores/functions";

const singleAssoStore = useSingleAssoStore();
const functionsStore = useFunctionsStore();
</script>

<template>
  <div class="asso-header flex flex-column items-center px-24 py-16">
    <div class="container flex gap-8">
      <img
          class="asso-logo"
          :alt="'Logo ' + singleAssoStore.currentAsso?.name"
          :src="singleAssoStore.currentAsso?.logo"/>
      <div class="flex flex-col gap-4 justify-center">
        <div class="asso-name flex gap-4 items-end">
          <h1 class="text-4xl font-semibold">{{ singleAssoStore.currentAsso?.name }}</h1>
          <span class="text-xl text-gray-600">{{ singleAssoStore.currentAsso?.category }}</span>
        </div>
        <span class="text-xl text-justify">{{ singleAssoStore.currentAsso?.content }}</span>
        <div class="flex w-full gap-4">
          <div v-for="(socialNetwork, index) of singleAssoStore.currentAsso?.socialNetworks" :key="index">
            <a :href="socialNetwork.link" target="_blank" rel="noopener noreferrer">
              <i :class="functionsStore.getSocialNetworkIcon(socialNetwork.name)" class="text-3xl cursor-pointer"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asso-logo {
  width: 300px;
  height: 300px;
}

@media (max-width: 708px) {
  .asso-header {
    padding: 2rem 3rem;
  }

  .asso-header .container {
    flex-direction: column;
    align-items: center;
  }

  .asso-header .container > div {
    align-items: center;
  }

  .asso-header .container > div .asso-name {
    flex-direction: column;
    align-items: center;
  }

  .asso-header .container > div > div:last-child {
    justify-content: center;
  }
}
</style>