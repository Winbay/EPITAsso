<script setup lang="ts">
import MainHeader from "@/components/common/layout/MainHeader.vue";
import MainFooter from "@/components/common/layout/MainFooter.vue";
import { onMounted, ref, watch } from 'vue'
import {useUserStore} from "@/stores/user";
import Toast from "primevue/toast";
import { useFunctionsStore } from '@/stores/functions'

const userStore = useUserStore()
const functionsStore = useFunctionsStore()

onMounted(async () => {
  await userStore.checkLoginAndFetchUser()
})

const reloadHeader = ref(false)
watch(() => functionsStore.shouldReloadHeader, () => {
  reloadHeader.value = true
  setTimeout(() => {
    reloadHeader.value = false
  }, 100)
});
</script>

<template>
  <MainHeader v-if="!reloadHeader"/>
  <router-view/>
  <MainFooter />
  <Toast />
</template>

<style>

</style>
