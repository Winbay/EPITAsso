<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import FAQ from '@/components/FAQ.vue'
import type { Association, AssociationDetail, SocialNetwork } from '@/types/associationInterfaces'
import { getSocialNetworkImage } from '@/utils/associationUtils'
import '@/fixtures/associations'
import AssociationService from '@/services/association/association'
import SocialNetworkService from '@/services/association/socialNetwork'
import FaqService from '@/services/association/faq'

// TODO associationId should be dynamic
const ASSOCIATION_ID = 1

const toast = useToast()
const associationService: AssociationService = new AssociationService(toast)
const socialNetworkService: SocialNetworkService = new SocialNetworkService(toast, ASSOCIATION_ID)
const faqService: FaqService = new FaqService(toast, ASSOCIATION_ID)

const isLoading = ref(true)

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  description: '',
  location: 'KB',
  logoUrl: '',
  socialNetworks: [],
  faq: []
})

const getDefaultSocialNetwork = (): SocialNetwork => ({
  id: -1,
  name: '',
  link: ''
})

const associationRef = ref<AssociationDetail>(getDefaultAssociation())

const newSocialNetworkRef = ref<SocialNetwork>(getDefaultSocialNetwork())
const activeEditElementRef = ref<string | null>(null)
const isEditingNameRef = ref(false)
const isEditingDescriptionRef = ref(false)
const showAddSocialNetworkDialogRef = ref(false)

const isNameEmpty = computed(() => {
  return associationRef.value.name.trim() === ''
})

const isDescriptionEmpty = computed(() => {
  return associationRef.value.description.trim() === ''
})

const isSocialNetworkFormValid = computed(() => {
  return newSocialNetworkRef.value.name.trim() !== '' && newSocialNetworkRef.value.link.trim() !== ''
})

const showEditIcon = (value: string | null, show: boolean = true): void => {
  activeEditElementRef.value = show ? value : null
}

const toggleEditingName = (): void => {
  isEditingNameRef.value = !isEditingNameRef.value
  isEditingDescriptionRef.value = false
}

const toggleEditingDescription = (): void => {
  isEditingDescriptionRef.value = !isEditingDescriptionRef.value
  isEditingNameRef.value = false

  if (!isEditingDescriptionRef.value) {
    associationRef.value.description = associationRef.value.description.trim()
  }
}

const handleImageClick = (): void => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', handleImageChange)
  input.click()
}

const handleImageChange = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (!input || !input.files || input.files.length === 0) {
    return
  }
  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = () => {
    if (reader.result) {
      associationRef.value.logoUrl = reader.result.toString()
    }
  }

  if (file) {
    reader.readAsDataURL(file)
  }
}

const addSocialNetwork = (): void => {
  if (isSocialNetworkFormValid.value) {
    associationRef.value.socialNetworks.push(newSocialNetworkRef.value)
    cancelAddSocialNetwork()
  }
}

const cancelAddSocialNetwork = (): void => {
  newSocialNetworkRef.value = getDefaultSocialNetwork()
  showAddSocialNetworkDialogRef.value = false
}

const saveChanges = async (): Promise<void> => {
  await associationService.updateAssociation(associationRef.value)
}

const reloadMyAssociation = async (): Promise<void> => {
  // TODO : Replace by an associationDetailService
  const association = await associationService.getAssociationById(ASSOCIATION_ID)
  // const socialNetworks = await socialNetworkService.getSocialNetworks()
  // const faqs = await faqService.getFaqs()

  associationRef.value = {
    ...association,
    socialNetworks: [],
    faq: []
  }
  isLoading.value = false
}

onMounted(async () => {
  await reloadMyAssociation()
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
            :src="associationRef.logoUrl"
            width="250"
            height="250"
            title="Logo Association"
          ></Image>
          <i
            v-if="activeEditElementRef === 'image'"
            class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
            @click.stop="handleImageClick"
          ></i>
        </div>
        <div class="flex flex-col w-full">
          <div v-if="isEditingNameRef" class="font-bold text-2xl">
            <InputText
              v-model="associationRef.name"
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
            <h1 v-else>{{ associationRef.name }}</h1>
            <i
              v-if="activeEditElementRef === 'name'"
              class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
              @click.stop="toggleEditingName"
            ></i>
          </div>
          <div v-if="isEditingDescriptionRef">
            <Textarea
              v-model="associationRef.description"
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
            <p v-else class="mb-2 whitespace-pre-wrap">{{ associationRef.description }}</p>
            <i
              v-if="activeEditElementRef === 'description'"
              class="absolute top-0 right-0 m-2 hover:text-blue-200 cursor-pointer pi pi-pencil"
              @click.stop="toggleEditingDescription"
            ></i>
          </div>
          <div class="flex pt-5">
            <div v-for="socialNetwork in associationRef.socialNetworks" :key="socialNetwork.name">
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
              @click="showAddSocialNetworkDialogRef = true"
              outlined
            ></Button>
            <Dialog
              v-model:visible="showAddSocialNetworkDialogRef"
              modal
              header="Ajouter un réseau social"
              @hide="cancelAddSocialNetwork"
            >
              <div>
                <InputText
                  id="socialNetworkName"
                  v-model="newSocialNetworkRef.name"
                  placeholder="Nom du réseau social"
                  class="w-full mb-2 h-12"
                />
                <InputText
                  id="socialNetworkLink"
                  v-model="newSocialNetworkRef.link"
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
      <FAQ :association-id="associationRef.id"></FAQ>
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
