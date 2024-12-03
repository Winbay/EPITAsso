<script setup lang="ts">
import MainHeader from '@/components/common/layout/MainHeader.vue'
import MainFooter from '@/components/common/layout/MainFooter.vue'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import Toast from 'primevue/toast'
import { useFunctionsStore } from '@/stores/functions'

const userStore = useUserStore()
const functionsStore = useFunctionsStore()
const isLoading = ref(true)

onMounted(async () => {
  await userStore.checkLoginAndFetchUser()
  isLoading.value = false
})

const reloadHeader = ref(false)
watch(
  () => functionsStore.shouldReloadHeader,
  () => {
    reloadHeader.value = true
    setTimeout(() => {
      reloadHeader.value = false
    }, 100)
  }
)
</script>

<template>
  <div v-if="!isLoading" class="flex flex-col min-h-screen">
    <MainHeader v-if="!reloadHeader" />
    <div class="content">
      <router-view />
    </div>
    <MainFooter />
    <Toast />
  </div>
</template>

<style>
.content {
  flex: 1;
  place-content: center;
}
</style>
