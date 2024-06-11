<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';

import { ref, defineProps, type PropType } from 'vue';
import { useToast } from 'primevue/usetoast'
import type { AssociationDetail, Faq, SocialNetwork } from '@/types/associationInterfaces'
import { getSocialNetworkImage } from '@/utils/associationUtils';
import FAQ from '@/components/FAQ.vue'
import DialogSocialNetwork from '@/components/Dialog/DialogSocialNetwork.vue'
import AssociationDetailService from '@/services/association/associationDetailService'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true,
  },
  reloadAssociation: {
    type: Function,
    required: true
  },
  association: {
    type: Object as PropType<AssociationDetail>,
    required: true,
  },
});

const toast = useToast()
const associationDetailService: AssociationDetailService = new AssociationDetailService(toast, props.association.id);

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  description: '',
  location: '',
  logo: '',
  socialNetworks: [],
  faq: []
})

const getDefaultSocialNetwork = (): SocialNetwork => ({
  id: -1,
  name: '',
  link: ''
})

const currAssociationRef = ref<AssociationDetail>(props.association);

const visibleDialogRef = ref(false)
const editSocialNetworkRef = ref<SocialNetwork>(getDefaultSocialNetwork())

const closeDialog = (socialNetwork: SocialNetwork | null): void => {
  if (socialNetwork) {
    if (socialNetwork.id !== -1) {
      const index = currAssociationRef.value.socialNetworks.findIndex((item) => item.id === socialNetwork.id)
      currAssociationRef.value.socialNetworks[index] = socialNetwork
    } else {
      currAssociationRef.value.socialNetworks.push(socialNetwork)
    }
  }
  editSocialNetworkRef.value = getDefaultSocialNetwork()
  visibleDialogRef.value = false
}

const editSocialNetwork = (index: number): void => {
  editSocialNetworkRef.value = currAssociationRef.value.socialNetworks[index]
  visibleDialogRef.value = true
}

const edit = async (): Promise<void> => {
  if (props.association) {
    await associationDetailService.updateAssociationDetail(currAssociationRef.value)
  }
  await props.reloadAssociation()
  props.setHidden()
}

const cancelDialog = (): void => {
  if (props.association) {
    currAssociationRef.value = props.association
  }
  else {
    currAssociationRef.value = getDefaultAssociation()
  }
  props.setHidden();
};

const handleImageClick = (): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', handleImageChange);
  input.click();
};

const handleImageChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (!input || !input.files || input.files.length === 0) {
    return;
  }
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    if (reader.result && currAssociationRef.value) {
      currAssociationRef.value.logo = reader.result.toString();
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <Dialog
    class="dialog-association"
    modal
    :visible="true"
    @update:visible="cancelDialog"
    :header="'Modification de l\'association'"
  >
    <div v-if="currAssociationRef">
      <div class="mb-6 mt-6 flex items-center justify-center">
        <div class="relative">
          <Avatar :image="currAssociationRef.logo" shape="circle" style="width: 10rem; height: 10rem" />
          <div class="edit-overlay" @click="handleImageClick" style="width: 10rem; height: 10rem">
            <i class="pi pi-pencil" style="font-size: 2rem"></i>
          </div>
        </div>
        <div class="ml-4">
          <label for="associationName" class="block mb-2 text-2xl font-bold text-wrap">Nom de l'association</label>
          <InputText
            id="associationName"
            v-model="currAssociationRef.name"
            aria-describedby="name-help"
            placeholder="Nom de l'association"
            maxlength="255"
            class="w-full" />
        </div>
      </div>

      <div class="mb-6">
        <label for="associationDescription" class="block mb-2 text-2xl font-bold text-wrap">Description de l'association</label>
        <Textarea id="associationDescription" v-model="currAssociationRef.description" class="w-full" rows="5" autoResize />
      </div>

      <div class="mb-6">
        <label class="block mb-2 text-2xl font-bold text-wrap">Réseaux sociaux</label>
        <div class="flex items-center">
          <div
            v-for="(socialNetwork, index) in currAssociationRef.socialNetworks"
            :key="socialNetwork.name"
            class="relative mr-2">
            <Avatar
              @click="editSocialNetwork(index)"
              :image="getSocialNetworkImage(socialNetwork.name)"
              class="cursor-pointer"
              style="width: 4rem; height: 4rem"
              shape="circle"
              :title="socialNetwork.name"/>
            <div class="edit-overlay" @click="editSocialNetwork(index)" style="width: 4rem; height: 4rem">
              <i class="pi pi-pencil edit-overlay-icon"></i>
            </div>
          </div>
          <Button
            @click="visibleDialogRef = true"
            icon="pi pi-plus"
            style="width: 4rem; height: 4rem"
            class="p-button-rounded p-button-outlined" />
          <DialogSocialNetwork
            v-if="visibleDialogRef"
            v-model:visible="visibleDialogRef"
            :set-hidden="closeDialog"
            :social-network="JSON.parse(JSON.stringify(editSocialNetworkRef))" />
        </div>
      </div>

      <FAQ
        :editing="true"
        :faq="currAssociationRef.faq" />

      <div class="mt-6 flex justify-start">
        <Button label="Annuler" class="mr-4" severity="secondary" @click="cancelDialog" />
        <Button label="Sauvegarder" severity="success" @click="edit" />
      </div>
    </div>
  </Dialog>
</template>

<style>
.dialog-association {
  width: 764px;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.edit-overlay:hover {
  opacity: 1;
}
</style>