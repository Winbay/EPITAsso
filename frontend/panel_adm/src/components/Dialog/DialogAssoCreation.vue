<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import axios from 'axios'
import { type FsValidationResult } from 'vue-file-selector/dist'

import { ref, defineProps } from 'vue'
import type { AssociationCreation, LogoAsso } from '@/types/assoInterfaces'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadAssos: {
    type: Function,
    required: true
  }
})

const toast = useToast()

const currAsso = ref<AssociationCreation>({
  name: '',
  description: '',
  location: 'KB',
  logo: 0
})
const currLogo = ref<{ file: File | null; url: string }>({ file: null, url: '' })
const isLoading = ref<boolean>(false)

const createAsso = async () => {
  if (currAsso.value.name === '' || !currLogo.value.file) {
    toast.add({
      severity: 'error',
      summary: 'Association',
      detail: 'Veuillez au moins ajouter un nom et un logo pour créer une association.',
      life: 3000
    })
    return false
  }
  // First upload image
  try {
    const formData = new FormData()
    formData.append('image', currLogo.value.file)
    const rep = await axios.post<LogoAsso>(`/api/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    currAsso.value.logo = rep.data['id']
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Image',
      detail: "L'image n'a pas pu être uploadée.",
      life: 3000
    })
    return false
  }
  try {
    await axios.post(`/api/associations`, currAsso.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Association',
      detail: "L'association n'a pas pu être créé.",
      life: 3000
    })
    return false
  }
  currAsso.value = { name: '', description: '', location: 'KB', logo: 0 }
  currLogo.value = { file: null, url: '' }
  await props.reloadAssos()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  currAsso.value = { name: '', description: '', location: 'KB', logo: 0 }
  currLogo.value = { file: null, url: '' }
  props.setHidden()
}

function handleFilesValidated(result: FsValidationResult, files: File[]) {
  return;
}

async function handleFilesChanged(files: File[]) {
  isLoading.value = true
  const promiseArr = files.map((f) => loadImgAsDataUrl(f))
  const imgs = await Promise.all(promiseArr)
  currLogo.value = { file: files[0], url: imgs[0] }
  isLoading.value = false
}

async function loadImgAsDataUrl(file: File) {
  const url: string = await new Promise((resolve) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = (e) => resolve(e.target?.result as string)
  })

  return url || ''
}
</script>

<template>
  <Dialog
    class="dialog-event h-full"
    modal
    @update:visible="cancelDialog"
    header="Création d'une association"
  >
    <div class="name mb-6 flex flex-col justify-start">
      <label for="name" class="mb-2 text-2xl font-bold text-wrap">Nom de l'association</label>
      <InputText
        id="name"
        v-model="currAsso.name"
        aria-describedby="username-help"
        placeholder="Nom de l'association"
        maxlength="255"
        class="max-w-3xl"
      />
    </div>
    <div class="description mb-6 flex flex-col justify-start">
      <label for="description" class="mb-2 text-2xl font-bold text-wrap">Description</label>
      <Textarea id="description" v-model="currAsso.description" rows="6" cols="50" />
<!--      <Button label="Display" @click="console.log(currLogo)"></Button>-->
    </div>
    <div class="mb-6 flex flex-col justify-start w-8/12">
      <label class="mb-2 text-xl font-bold text-wrap">Campus</label>
      <SelectButton
        v-model="currAsso.location"
        :options="['KB', 'VJ']"
        aria-labelledby="basic"
        :allow-empty="false"
      />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <label class="mb-2 text-xl font-bold text-wrap">Logo</label>
      <FileSelector
        accept-extensions=".jpg,.svg,.png,.jpeg,.webp"
        :multiple="false"
        :is-loading="isLoading"
        :max-file-size="5 * 1024 * 1024"
        @validated="handleFilesValidated"
        @changed="handleFilesChanged"
      >
        Sélectionner une image

        <template #top>
          <div class="section-top mb-4">
            <p class="mb-4">
              Vous pouvez cliquer sur le bouton ci-dessous ou déposer un fichier dans cette zone.
            </p>
            Taille maximum autorisée : 5 MB.<br />
            Extensions de fichier : JPG, JPEG, PNG, WEBP, SVG.
          </div>
        </template>

        <template #bottom>
          <div v-if="currLogo.file" class="section-bottom mt-4">
            <img
              :src="currLogo.url"
              :alt="currLogo.file?.name ?? 'logo asso'"
              style="width: 200px"
            />
          </div>
        </template>

        <template #loader>
          <div class="section-loader mt-4">
            Vérification des fichiers<br />
            veuillez attendre...
          </div>
        </template>
      </FileSelector>
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button label="Créer" severity="success" class="w-1/4" @click="createAsso" />
      </div>
    </div>
  </Dialog>
</template>

<style>
.dialog-event {
  width: 764px;
}

.fs-file-selector {
  margin-top: 1rem;
  user-select: none;
  position: sticky !important;
  top: -2px;
  text-align: center;
  background-color: rgba(0, 132, 132, 0.05);
  backdrop-filter: blur(35px) saturate(200%);
  border-top: 2px solid #008484;
  border-bottom: 2px solid #008484;
  transition: all ease 300ms;
}
.fs-file-selector .fs-droppable {
  padding: 2rem 0;
  transition: all ease 200ms;
}
.fs-file-selector .fs-btn-select {
  background-color: var(--primary-color);
  padding: 0.75rem 2rem;
  color: #fff;
  border-radius: 5px;
  transition: all ease 200ms;
}
.fs-file-selector .fs-btn-select:hover {
  cursor: pointer;
  background-color: #009e9e;
}
.fs-file-selector .fs-btn-select:active {
  background-color: #006b6b;
  transform: scale(0.95);
  transition: all ease 60ms;
}
.fs-file-selector .fs-loader {
  background-color: transparent !important;
}
.fs-file-selector.fs-drag-enter {
  background-color: rgba(0, 132, 132, 0.1);
}
.fs-file-selector.fs-drag-enter .fs-droppable {
  transition: all ease 100ms;
  transform: scale(0.98);
}
</style>
