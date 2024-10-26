<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { AssociationWithLogo } from '@/types/associationInterfaces'
import SelectedAssoService from '@/services/association/selectedAsso'
import { useUserStore } from '@/stores/user'
import Button from 'primevue/button'

const userAssociations = ref<AssociationWithLogo[]>([])
const assoToDisplay = ref<AssociationWithLogo | undefined>()
const userStore = useUserStore()
const currentUser = computed(() => userStore.user)

const currentUserSchool = computed((): string => {
  if (userStore.user) return userStore.user.school
  else return ''
})

const getUserAssociations = async (): Promise<void> => {
  userAssociations.value = await SelectedAssoService.getUserAssociations()
  if (userAssociations.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * userAssociations.value.length)
    assoToDisplay.value = userAssociations.value[randomIndex]
  }
}

watch(currentUser, async (newUser) => {
  if (newUser) {
    await getUserAssociations()
  }
})

onMounted(async () => {
  if (userStore.user) {
    await getUserAssociations()
  }
})
</script>

<template>
  <div v-if="assoToDisplay" class="module-my-asso flex">
    <img :src="assoToDisplay.logo" :alt="assoToDisplay.name + ' logo'" class="mr-7" />
    <div class="content flex flex-col justify-center gap-2">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">{{ assoToDisplay.name }}</span>
        <span class="font-semibold text-gray-500">{{ assoToDisplay.category }}</span>
      </div>
      <div class="flex gap-4">
        <a class="btn-route" :href="'/associations/' + assoToDisplay.slug">Voir la page</a>
        <a class="btn-route" :href="'/events/'">Voir les évènements</a>
      </div>
    </div>
  </div>
  <div
    v-else-if="userStore.user"
    class="module-my-asso flex flex-col justify-center items-center gap-2"
  >
    <span class="text-xl font-semibold text-center"
      >Rejoignez une association et commencez à participer à la vie associative d'{{
        currentUserSchool.toLowerCase() === 'epita' ? 'EPITA' : 'EPITECH'
      }}
      !</span
    >
    <a class="btn-route" href="/associations/">Voir les associations</a>
  </div>
  <div v-else class="module-my-asso flex flex-col justify-center items-center gap-2">
    <span class="text-xl font-semibold text-center"
      >Connectez-vous avec le compte Microsoft de votre école pour voir vos associations.</span
    >
    <Button
      class="btn-connection p-2 w-1/4"
      label="Connexion"
      @click="userStore.checkLoginAndFetchUser(true)"
    />
  </div>
</template>

<style>
.module-my-asso {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 20px 30px;
}

.module-my-asso img {
  height: 6rem;
  width: 6rem;
  border-radius: 100px;
}

.btn-route {
  padding: 4px 8px;
  background-color: #287094;
  border-radius: 6px;
  color: white;
}

@media (max-width: 708px) {
  .module-my-asso .content > div {
    flex-direction: column;
  }
}
</style>
