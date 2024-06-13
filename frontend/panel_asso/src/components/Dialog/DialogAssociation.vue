<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';

import { ref, defineProps, type PropType } from 'vue';
import { useToast } from 'primevue/usetoast'
import type { Association, AssociationDetail, SocialNetwork } from '@/types/associationInterfaces'
import FAQ from '@/components/FAQ.vue'
import FaqService from '@/services/association/faq'
import SocialNetworkService from '@/services/association/socialNetwork'
import AssociationService from '@/services/association/association'
import SocialNetworks from '@/components/SocialNetworks.vue'

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
const associationService: AssociationService = new AssociationService(toast);
const socialNetworkService: SocialNetworkService = new SocialNetworkService(toast, props.association.id);
const faqService: FaqService = new FaqService(toast, props.association.id);

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  description: '',
  location: '',
  logo: '',
  socialNetworks: [],
  faq: []
})

const currAssociationRef = ref<AssociationDetail>(props.association);
const initialAssociationRef = ref<AssociationDetail>(JSON.parse(JSON.stringify(props.association)));

const isAssociationModified = (): boolean => {
  const initAsso : Association = {
    id: initialAssociationRef.value.id,
    name: initialAssociationRef.value.name,
    description: initialAssociationRef.value.description,
    location: initialAssociationRef.value.location,
    logo: initialAssociationRef.value.logo,
  }
  const currAsso : Association = {
    id: currAssociationRef.value.id,
    name: currAssociationRef.value.name,
    description: currAssociationRef.value.description,
    location: currAssociationRef.value.location,
    logo: currAssociationRef.value.logo,
  }
  return JSON.stringify(initAsso) !== JSON.stringify(currAsso);
}

const isSocialNetworksModified = (): boolean => {
  return JSON.stringify(initialAssociationRef.value.socialNetworks) !== JSON.stringify(currAssociationRef.value.socialNetworks);
}

const isFaqModified = (): boolean => {
  return JSON.stringify(initialAssociationRef.value.faq) !== JSON.stringify(currAssociationRef.value.faq);
}

const edit = async (): Promise<void> => {
  if (currAssociationRef.value) {
    if (isAssociationModified()) {
      await associationService.updateAssociation(currAssociationRef.value)
    }
    if (isSocialNetworksModified()) {
      await socialNetworkService.updateSocialNetworks(currAssociationRef.value.socialNetworks)
    }
    if (isFaqModified()) {
      await faqService.updateFaqs(currAssociationRef.value.faq)
    }
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

      <SocialNetworks
        :socialNetworks="currAssociationRef.socialNetworks" />

      <FAQ
        :editing="true"
        :faq="currAssociationRef.faq" />

      <div class="mt-6 flex justify-start gap-4">
        <Button label="Annuler" severity="secondary" @click="cancelDialog" />
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