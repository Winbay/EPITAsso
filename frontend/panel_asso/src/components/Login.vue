<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import { ref } from 'vue';
import FloatLabel from 'primevue/floatlabel'

const visible = ref(false);
const usernameOrEmail = ref('');
const password = ref('');
const handleLogin = () => {
  visible.value = false;
};

const handleMicrosoftLogin = () => {
  visible.value = false;
};
</script>

<template>
  <div class="container flex items-center justify-center h-screen">
    <div class="card flex flex-col justify-center text-center p-6 rounded-lg w-96">
      <h1 class="text-2xl font-bold mb-6">LOG IN</h1>
      <div class="mb-6">
        <FloatLabel class="w-full">
          <InputText id="usernameOrEmail" v-model="usernameOrEmail" style="height: 40px;" class="w-full"/>
          <label for="usernameOrEmail">Username or Email</label>
        </FloatLabel>
      </div>
      <div class="mb-6">
        <FloatLabel class="w-full">
          <InputText id="password" v-model="password" type="password" style="height: 40px;" class="w-full"/>
          <label for="password">Password</label>
        </FloatLabel>
      </div>
      <Button label="Connexion" icon="pi pi-sign-in" @click="handleLogin" text class="mb-6 w-full" style="font-weight: bold;"/>
      <Divider align="center">
        <p>ou connectez-vous avec</p>
      </Divider>
      <Button @click="handleMicrosoftLogin" severity="info" text class="mt-6 w-full justify-center" style="font-weight: bold;">
        <img src="../assets/microsoft.png" alt="Microsoft Logo" class="w-6 h-6 mr-3" />
        Microsoft
      </Button>
    </div>
  </div>
</template>

<style>
.p-divider .p-divider-content {
  background-color: #131923;
}

.p-divider-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  vertical-align: middle;
}
</style>
