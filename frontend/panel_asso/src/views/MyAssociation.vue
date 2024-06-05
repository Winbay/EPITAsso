<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import ProgressSpinner from 'primevue/progressspinner';

import FAQ from '@/components/FAQ.vue'

import type { Association, FAQItem } from '@/types/associationInterfaces'
import * as associationServices from '@/services/associationServices'
import { useToast } from 'primevue/usetoast'
import '@/fixtures/associations'
import { getSocialNetworkImage } from '@/utils/associationUtils'
const toast = useToast()

const isLoading = ref(true)

const myAssociation = ref<Association>({
  id: -1,
  name: '',
  description: '',
  location: 'KB',
  logo: {
    id: -1,
    url: ''
  },
  members: [],
  socialNetworks: [],
  faq: []
})

const newSocialNetwork = ref({ id: -1, name: '', link: '' })

const activeEditElement = ref<string | null>(null)
const isEditingName = ref(false)
const isEditingDescription = ref(false)
const showAddSocialNetworkDialog = ref(false)

const isNameEmpty = computed(() => {
  if (myAssociation.value.name.trim() === '') {
    return true
  }
  return false
})

const isDescriptionEmpty = computed(() => {
  if (myAssociation.value.description.trim() === '') {
    return true
  }
  return false
})

const showEditIcon = (value: string | null, show: boolean = true) => {
  if (show) {
    activeEditElement.value = value
  } else {
    activeEditElement.value = null
  }
}

const toggleEditingName = () => {
  isEditingName.value = !isEditingName.value
  isEditingDescription.value = false
}

const toggleEditingDescription = () => {
  isEditingDescription.value = !isEditingDescription.value
  isEditingName.value = false

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

const handleUpdateQuestion = ({ index, question }: { index: number; question: FAQItem }) => {
  myAssociation.value.faq[index] = question
}

const handleAddQuestion = (question: FAQItem) => {
  myAssociation.value.faq.push(question)
}

const handleDeleteQuestion = (index: number) => {
  myAssociation.value.faq.splice(index, 1)
}

async function saveChanges() {
  await associationServices.updateAssociation(myAssociation.value, toast)
}

async function loadMyAssociation() {
  await associationServices.getAssociationById(1, toast).then((response) => {
    if (response) {
      myAssociation.value = response
      isLoading.value = false
    }
  })
}

onMounted(async () => {
  await loadMyAssociation()
})
</script>

<template>
  <div v-if="isLoading" class="spinner">
    <ProgressSpinner />
  </div>
  <div v-else>
    <Button
      icon="pi pi-save"
      @click="saveChanges"
      class="p-button-rounded p-button-text absolute top-10 right-0 mt-5 mr-5"
      style="color: white; z-index: 5"
      size="large"
    />
    <ScrollPanel
      class="flex content-center"
      style="width: 100%; height: calc(100vh - 1.25rem - 20px)"
    >
      <div class="flex gap-5 mt-5 pl-20 pr-20">
        <div class="relative" @mouseover="showEditIcon('image')" @mouseleave="showEditIcon(null)">
          <Image
            :src="myAssociation.logo.url"
            width="250"
            height="250"
            title="Logo Association"
          ></Image>
          <i
            v-if="activeEditElement === 'image'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="handleImageClick"
          ></i>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="isEditingName" class="font-bold text-2xl">
            <InputText
              v-model="myAssociation.name"
              autofocus
              @blur="toggleEditingName"
              placeholder="Titre de l'association"
            ></InputText>
          </div>
          <div
            v-else
            class="relative"
            @mouseover="showEditIcon('name', !isNameEmpty)"
            @mouseleave="showEditIcon(null)"
          >
            <div v-if="isNameEmpty">
              <Button @click="toggleEditingName" outlined>Ajouter un titre</Button>
            </div>
            <h1 v-else>{{ myAssociation.name }}</h1>
            <i
              v-if="activeEditElement === 'name'"
              class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
              @click.stop="toggleEditingName"
            ></i>
          </div>
          <div v-if="isEditingDescription">
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
            @mouseover="showEditIcon('description', !isDescriptionEmpty)"
            @mouseleave="showEditIcon(null)"
          >
            <div v-if="isDescriptionEmpty" class="mt-2">
              <Button @click="toggleEditingDescription" outlined>Ajouter une description</Button>
            </div>
            <p v-else class="mb-2 whitespace-pre-wrap">{{ myAssociation.description }}</p>
            <i
              v-if="activeEditElement === 'description'"
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
            <Button
              icon="pi pi-plus"
              class="w-8 h-8"
              rounded
              @click="showAddSocialNetworkDialog = true"
              outlined
            ></Button>
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
      <FAQ
        :association-id="myAssociation.id"
        @update-question="handleUpdateQuestion"
        @add-question="handleAddQuestion"
        @delete-question="handleDeleteQuestion"
      ></FAQ>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.spinner {
  height: 100vh;
  align-content: center;
  text-align: center;
}
</style>
