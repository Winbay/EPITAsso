<script setup lang="ts">
import MainHeader from "@/components/common/layout/MainHeader.vue";
import MainFooter from "@/components/common/layout/MainFooter.vue";
import {onMounted} from "vue";
import {useUserStore} from "@/stores/user";
import Toast from "primevue/toast";

const userStore = useUserStore()

onMounted(async () => {
  await userStore.checkLoginAndFetchUser()
})
</script>

<template>
  <MainHeader/>
  <router-view/>
  <MainFooter />
  <Toast />
</template>

<style>

</style>
