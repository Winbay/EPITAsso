<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import FAQ from '@/components/FAQ.vue'

import type { Association } from '@/types/associationInterfaces'
import * as associationServices from '@/services/associationServices'
import { useToast } from 'primevue/usetoast'
import '@/fixtures/associations'
import { getSocialNetworkImage } from '@/utils/associationUtils'
const toast = useToast()

const myAssociation = ref<Association>({
  id: -1,
  name: '',
  description: '',
  location: 'KB',
  logo: {
    id: -1,
    url: ''
  },
  socialNetworks: []
})

const newSocialNetwork = ref({ id: -1, name: '', link: '' })

const showEditIcon = ref('')
const isEditingTitle = ref(false)
const isEditingDescription = ref(false)
const showAddSocialNetworkDialog = ref(false)

const toggleEditingTitle = () => {
  isEditingTitle.value = !isEditingTitle.value
  isEditingDescription.value = false
}

const toggleEditingDescription = () => {
  isEditingDescription.value = !isEditingDescription.value
  isEditingTitle.value = false

  if (!isEditingDescription.value) {
    myAssociation.value.description = myAssociation.value.description.trim()
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
      myAssociation.value.logo.url = reader.result.toString()
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
    myAssociation.value.socialNetworks.push({ ...newSocialNetwork.value })
    cancelAddSocialNetwork()
  }
}

const cancelAddSocialNetwork = () => {
  newSocialNetwork.value = { id: -1, name: '', link: '' }
  showAddSocialNetworkDialog.value = false
}

async function saveChanges() {
  await associationServices.updateAssociation(myAssociation.value, toast)
}

async function loadMyAssociation() {
  await associationServices.getAssociationById(1, toast)
    .then((response) => {
      if (response) {
        myAssociation.value = response
      }
    })
}

onMounted(async () => {
  console.log('mounted')
  await loadMyAssociation()
})

</script>


<template>
  <Button
    label="Enregistrer"
    icon="pi pi-save"
    @click="saveChanges"
    class="p-button-rounded p-button-text p-button-sm absolute top-10 right-0 mt-2 mr-2"
    style="background-color: #f0f0f0; color: #333; z-index: 5"
  />
  <ScrollPanel class="mt-5" style="width: 100%; height: 100%">
    <div class="association-header">
      <div class="relative" @mouseover="showEditIcon = 'image'" @mouseleave="showEditIcon = ''">
        <Image :src="myAssociation.logo.url" width="250" title="Logo Association"></Image>
        <i
          v-if="showEditIcon === 'image'"
          class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
          @click.stop="handleImageClick"
        ></i>
      </div>
      <div class="flex flex-col ml-5 pr-2">
        <div v-if="isEditingTitle" class="font-bold text-2xl">
          <InputText
            v-model="myAssociation.name"
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
          <p v-if="myAssociation.name.trim() === ''">
            <Button @click="toggleEditingTitle" :style="{ margin: '10px' }"
              >Ajouter un titre</Button
            >
          </p>
          <p v-else class="mb-2 font-bold text-2xl">{{ myAssociation.name }}</p>
          <i
            v-if="showEditIcon === 'title'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="toggleEditingTitle"
          ></i>
        </div>
        <div v-if="isEditingDescription" class="association-description">
          <Textarea
            v-model="myAssociation.description"
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
          <p v-if="myAssociation.description.trim() === ''">
            <Button @click="toggleEditingDescription" :style="{ margin: '10px' }"
              >Ajouter une description</Button
            >
          </p>
          <p v-else class="mb-2 whitespace-pre-wrap">{{ myAssociation.description }}</p>
          <i
            v-if="showEditIcon === 'description'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="toggleEditingDescription"
          ></i>
        </div>
        <div class="flex pt-5">
          <div v-for="socialNetwork in myAssociation.socialNetworks" :key="socialNetwork.name">
            <a :href="socialNetwork.link" target="_blank">
              <Avatar
                :image="getSocialNetworkImage(socialNetwork.name)"
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



<style scoped>
.association-header {
  width: fit-content;
  height: fit-content;
  padding-left: 50px;
  padding-right: 150px;
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
