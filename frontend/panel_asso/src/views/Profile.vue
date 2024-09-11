<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { ACCESS_TOKEN_KEY, ASSOCIATION_ID, REFRESH_TOKEN_KEY } from '@/services/api'

const userStore = useUserStore()
const user = ref(userStore.getUser)

const logout = () => {
  userStore.setUser(null)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(ASSOCIATION_ID)
  window.location.href = '/'
}

const emits = defineEmits(['close'])

const closeProfile = (): void => {
  emits('close')
}
const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeProfile()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeProfile"></div>

  <div class="absolute z-50 flex justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <Card
      class="relative m-10 card flex flex-col justify-center text-center p-8 rounded-lg w-fit bg-gray-800 text-white shadow-lg"
    >
      <template #title>
        <h2 class="text-2xl font-semibold mb-4">Profil Utilisateur</h2>
        <Button
          icon="pi pi-times"
          class="p-button-secondary p-button-rounded p-button-text"
          style="position: absolute; top: 1rem; right: 1rem;"
          @click="closeProfile"
        />
      </template>
      <template #content>
        <div class="p-fluid text-left flex gap-10">
          <div>
            <h3 class="text-xl font-semibold mb-2">Compte</h3>
            <div class="p-field mb-4">
              <label for="login" class="block mb-1">Identifiant</label>
              <h3 id="login">{{ user!.login }}</h3>
            </div>
            <div class="p-field mb-4">
              <label for="email" class="block mb-1">Adresse Email</label>
              <h3 id="email">{{ user!.email }}</h3>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-2">Identité</h3>
            <div class="p-field mb-4">
              <label for="firstname" class="block mb-1">Prénom</label>
              <h3 id="firstname">{{ user!.firstName }}</h3>
            </div>
            <div class="p-field mb-4">
              <label for="lastname" class="block mb-1">Nom</label>
              <h3 id="lastname">{{ user!.lastName }}</h3>
            </div>
            <div class="p-field mb-4">
              <label for="school" class="block mb-1">École</label>
              <h3 id="school">{{ user!.school }}</h3>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-center">
          <Button
            label="Déconnexion"
            icon="pi pi-sign-out"
            class="p-button-danger"
            @click="logout"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.p-field label {
  color: #505f77;
}
</style>
