<script setup lang="ts">
import Button from 'primevue/button'

const handleMicrosoftLogin = () => {
  const redirectUri = import.meta.env.VITE_REDIRECT_URI
  const apiUrl = import.meta.env.VITE_API_URL
  window.location.href = `${apiUrl}/api/auth/authorize?redirect_uri=${redirectUri}`
}
</script>

<template>
  <div class="login-container">
    <div class="card flex flex-col justify-center text-center p-6 rounded-lg w-96">
      <h1 class="text-2xl font-bold mb-6">LOG IN</h1>
      <Button
        @click="handleMicrosoftLogin"
        severity="info"
        text
        class="mt-6 w-full justify-center"
        style="font-weight: bold"
      >
        <img src="../assets/microsoft.png" alt="Microsoft Logo" class="w-6 h-6 mr-3" />
        Microsoft
      </Button>
    </div>
  </div>
</template>

<style>
.login-container {
  background-color: #131923;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

img {
  vertical-align: middle;
}
</style>
