<template>
  <div class="relative text-right">
    <Button label="Annuler" @click="cancelChanges" severity="secondary" raised class="m-2" />
    <Button label="Enregistrer" @click="saveChanges" severity="success" raised class="m-2" />
  </div>
  <ScrollPanel style="width: 100%; height: 100%">
    <div class="association-header">
      <div class="relative" @mouseover="showEditIcon = 'image'" @mouseleave="showEditIcon = ''">
        <Image :src="imageSrc" width="250" title="Logo Association"></Image>
        <i
          v-if="showEditIcon === 'image'"
          class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
          @click.stop="handleImageClick"
        ></i>
      </div>
      <div class="flex flex-col ml-5 pr-2">
        <div v-if="isEditingTitle" class="font-bold text-2xl">
          <InputText
            v-model="associationName"
            autofocus
            @blur="toggleEditingTitle"
            placeholder="Titre de l'association"
          ></InputText>
        </div>
        <div
          v-else
          class="relative"
          @mouseover="showEditIcon = 'title'"
          @mouseleave="showEditIcon = ''"
        >
          <p v-if="associationName.trim() === ''">
            <Button @click="toggleEditingTitle" :style="{ margin: '10px' }"
              >Ajouter un titre</Button
            >
          </p>
          <p v-else class="mb-2 font-bold text-2xl">{{ associationName }}</p>
          <i
            v-if="showEditIcon === 'title'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="toggleEditingTitle"
          ></i>
        </div>
        <div v-if="isEditingDescription" class="association-description">
          <Textarea
            v-model="associationDescription"
            autofocus
            @blur="toggleEditingDescription"
            placeholder="Description de l'association"
            autoResize
            rows="5"
            class="h-full w-full border-none resize-none"
          ></Textarea>
        </div>
        <div
          v-else
          class="association-description relative"
          @mouseover="showEditIcon = 'description'"
          @mouseleave="showEditIcon = ''"
        >
          <p v-if="associationDescription.trim() === ''">
            <Button @click="toggleEditingDescription" :style="{ margin: '10px' }"
              >Ajouter une description</Button
            >
          </p>
          <p v-else class="mb-2 whitespace-pre-wrap">{{ associationDescription }}</p>
          <i
            v-if="showEditIcon === 'description'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="toggleEditingDescription"
          ></i>
        </div>
        <div class="flex pt-5">
          <div v-for="socialNetwork in socialNetworks" :key="socialNetwork.name">
            <a :href="socialNetwork.link" target="_blank">
              <Avatar
                :image="getSocialNetworkImage(socialNetwork.link)"
                class="mr-2"
                size="normal"
                shape="circle"
                :title="socialNetwork.name"
              ></Avatar>
            </a>
          </div>
          <Avatar
            image="/images/add-social-network-symbol.png"
            class="mr-2 cursor-pointer"
            size="normal"
            shape="circle"
            title="Add social network"
            @click="showAddSocialNetworkDialog = true"
          ></Avatar>
          <Dialog
            v-model:visible="showAddSocialNetworkDialog"
            modal
            header="Ajouter un réseau social"
            @hide="cancelAddSocialNetwork"
          >
            <div>
              <InputText
                id="socialNetworkName"
                v-model="newSocialNetwork.name"
                placeholder="Nom du réseau social"
                class="w-full mb-2 h-12"
              />
              <InputText
                id="socialNetworkLink"
                v-model="newSocialNetwork.link"
                placeholder="Lien vers le réseau social"
                class="w-full mb-2 h-12"
              />
              <div class="flex justify-end mt-5">
                <Button
                  label="Annuler"
                  icon="pi pi-times"
                  @click="cancelAddSocialNetwork"
                  class="mx-2"
                  severity="secondary"
                />
                <Button
                  label="Ajouter"
                  icon="pi pi-check"
                  @click="addSocialNetwork"
                  :disabled="!isSocialNetworkFormValid"
                  class="mx-2"
                  severity="success"
                />
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
    <FAQ></FAQ>
  </ScrollPanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import FAQ from '@/components/FAQ.vue'
import ScrollPanel from 'primevue/scrollpanel'

interface SocialNetwork {
  name: string
  link: string
}

const imageSrc = ref('/images/eptv.jpg')
const initialAssociationName = 'Mon Association'
const initialAssociationDescription =
  "Description de l'association - Lorem ipsum dolor sit amet, consectetur " +
  'adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ' +
  'magna aliqua- Ut enim ad minim veniam, quis nostrud exercitation ' +
  'ullamco laboris nisi ut aliquip ex'

const associationName = ref(initialAssociationName)
const associationDescription = ref(initialAssociationDescription)

const showEditIcon = ref('')
const isEditingTitle = ref(false)
const isEditingDescription = ref(false)
const showAddSocialNetworkDialog = ref(false)

const socialNetworks = ref<SocialNetwork[]>([
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/'
  },
  {
    name: 'Discord',
    link: 'https://discord.com/'
  }
])

const newSocialNetwork = ref<SocialNetwork>({
  name: '',
  link: ''
})

const toggleEditingTitle = () => {
  console.log('toggleEditingTitle')
  isEditingTitle.value = !isEditingTitle.value
  isEditingDescription.value = false
}

const toggleEditingDescription = () => {
  isEditingDescription.value = !isEditingDescription.value
  isEditingTitle.value = false

  if (!isEditingDescription.value) {
    associationDescription.value = associationDescription.value.trim()
  }
}

const handleImageClick = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', handleImageChange)
  input.click()
}

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input || !input.files || input.files.length === 0) {
    return
  }
  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = () => {
    if (reader.result) {
      imageSrc.value = reader.result.toString()
    }
  }

  if (file) {
    reader.readAsDataURL(file)
  }
}

const isSocialNetworkFormValid = computed(() => {
  return newSocialNetwork.value.name.trim() !== '' && newSocialNetwork.value.link.trim() !== ''
})

const addSocialNetwork = () => {
  if (isSocialNetworkFormValid.value) {
    socialNetworks.value.push({ ...newSocialNetwork.value })
    cancelAddSocialNetwork()
  }
}

const cancelAddSocialNetwork = () => {
  newSocialNetwork.value = { name: '', link: '' }
  showAddSocialNetworkDialog.value = false
}

const getSocialNetworkImage = (link: string) => {
  if (link.includes('instagram.com')) {
    return '/images/instagram-logo.png'
  } else if (link.includes('discord.com')) {
    return '/images/discord-logo.png'
  } else if (link.includes('twitch.tv')) {
    return '/images/twitch-logo.png'
  } else if (link.includes('twitter.com')) {
    return '/images/twitter-logo.png'
  }
  return '/images/default-social-network-logo.png'
}

const saveChanges = () => {
  console.log('Changes saved')
}

const cancelChanges = () => {
  console.log('Changes canceled')
  associationName.value = initialAssociationName
  associationDescription.value = initialAssociationDescription
}
</script>

<style scoped>
.association-header {
  width: fit-content;
  height: fit-content;
  padding-left: 50px;
  margin: 0 auto;
  display: flex;
}

.association-description {
  font-size: 1rem;
  font-weight: normal;
  width: 800px;
  min-width: 700px;
}
</style>
