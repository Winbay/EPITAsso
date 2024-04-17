<template>
  <div class="top-right-buttons">
    <Button label="Annuler" @click="cancelChanges" severity="secondary" raised />
    <Button label="Enregistrer" @click="saveChanges" severity="success" raised />
  </div>
  <div class="association-header">
    <div class="image-container border-round" @mouseover="showEditIcon = true" @mouseleave="showEditIcon = false">
      <Image
          :src="imageSrc"
          @click.stop="handleImageClick"
          width="250"
          title="Logo Association"
      ></Image>
      <i v-if="showEditIcon" class="pi pi-pencil edit-icon"></i>
    </div>
    <div class="text-content">
      <div v-if="isEditingTitle" class="association-title">
        <InputText
            v-model="associationName"
            autofocus
            @blur="toggleEditingTitle"
            placeholder="Titre de l'association"
        ></InputText>
      </div>
      <div v-else class="association-title">
        <p v-if="associationName.trim() === ''">
          <Button @click="toggleEditingTitle" :style="{ margin: '10px' }">Ajouter un titre</Button>
        </p>
        <p v-else @click="toggleEditingTitle">{{ associationName }}</p>
      </div>
      <div v-if="isEditingDescription" class="association-description">
        <Textarea
            v-model="associationDescription"
            autofocus
            @blur="toggleEditingDescription"
            placeholder="Description de l'association"
            :rows="associationDescription.split('\n').length + 2"
        ></Textarea>
      </div>
      <div v-else class="association-description">
        <p v-if="associationDescription.trim() === ''">
          <Button @click="toggleEditingDescription" :style="{ margin: '10px' }">Ajouter une description</Button>
        </p>
        <p v-else @click="toggleEditingDescription">{{ associationDescription }}</p>
      </div>
      <div class="social-network">
        <div v-for="socialNetwork in socialNetworks" :key="socialNetwork.name">
          <a :href="socialNetwork.link" target="_blank">
            <Avatar
                :image="getSocialNetworkImage(socialNetwork.link)"
                class="mr-2"
                size="medium"
                shape="circle"
                :title="socialNetwork.name"
            ></Avatar>
          </a>
        </div>
        <Avatar
            image="/images/add-social-network-symbol.png"
            class="mr-2 cursor-pointer"
            size="medium"
            shape="circle"
            title="Add social network"
            @click="showAddSocialNetworkDialog = true"
        ></Avatar>
        <Dialog
            v-model:visible="showAddSocialNetworkDialog"
            modal
            header="Ajouter un réseau social"
            @hide="cancelAddSocialNetwork">
          <div>
            <InputText id="socialNetworkName" v-model="newSocialNetwork.name" placeholder="Nom du réseau social" class="input-field"/>
            <InputText id="socialNetworkLink" v-model="newSocialNetwork.link" placeholder="Lien vers le réseau social" class="input-field"/>
            <div class="button-container">
              <Button label="Annuler" icon="pi pi-times" @click="cancelAddSocialNetwork" class="cancel-button" severity="secondary"/>
              <Button label="Ajouter" icon="pi pi-check" @click="addSocialNetwork" :disabled="!isSocialNetworkFormValid" class="add-button" severity="success"/>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
  <FAQ></FAQ>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Image from 'primevue/image';
import Avatar from 'primevue/avatar';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import FAQ from "@/components/FAQ.vue";

interface SocialNetwork {
  name: string;
  link: string;
}

const imageSrc = ref('/images/eptv.jpg');
const initialAssociationName = 'Mon Association';
const initialAssociationDescription = 'Description de l\'association - Lorem ipsum dolor sit amet, consectetur ' +
    'adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ' +
    'magna aliqua- Ut enim ad minim veniam, quis nostrud exercitation ' +
    'ullamco laboris nisi ut aliquip ex';

const associationName = ref(initialAssociationName);
const associationDescription = ref(initialAssociationDescription);

const showEditIcon = ref(false);
const isEditingTitle = ref(false);
const isEditingDescription = ref(false);
const showAddSocialNetworkDialog = ref(false);

const socialNetworks = ref<SocialNetwork[]>([
  {
    name: "Instagram",
    link: "https://www.instagram.com/",
  },
  {
    name: "Discord",
    link: "https://discord.com/",
  },
]);

const newSocialNetwork = ref<SocialNetwork>({
  name: "",
  link: "",
});

const toggleEditingTitle = () => {
  console.log('toggleEditingTitle');
  isEditingTitle.value = !isEditingTitle.value;
  isEditingDescription.value = false;
};

const toggleEditingDescription = () => {
  isEditingDescription.value = !isEditingDescription.value;
  isEditingTitle.value = false;

  if (!isEditingDescription.value) {
    associationDescription.value = associationDescription.value.trim();
  }
};

const handleImageClick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', handleImageChange);
  input.click();
};

const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files[0];
  const reader = new FileReader();

  reader.onload = () => {
    if (reader.result) {
      imageSrc.value = reader.result.toString();
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

const isSocialNetworkFormValid = computed(() => {
  return newSocialNetwork.value.name.trim() !== '' && newSocialNetwork.value.link.trim() !== '';
});

const addSocialNetwork = () => {
  if (isSocialNetworkFormValid.value) {
    socialNetworks.value.push({ ...newSocialNetwork.value });
    cancelAddSocialNetwork();
  }
};

const cancelAddSocialNetwork = () => {
  newSocialNetwork.value = { name: "", link: "" };
  showAddSocialNetworkDialog.value = false;
};

const getSocialNetworkImage = (link: string) => {
  if (link.includes("instagram.com")) {
    return "/images/instagram-logo.png";
  } else if (link.includes("discord.com")) {
    return "/images/discord-logo.png";
  } else if (link.includes("twitch.tv")) {
    return "/images/twitch-logo.png";
  } else if (link.includes("twitter.com")) {
    return "/images/twitter-logo.png";
  }
  return "/images/default-social-network-logo.png";
};

const saveChanges = () => {
  console.log('Changes saved');
};

const cancelChanges = () => {
  console.log('Changes canceled');
  associationName.value = initialAssociationName;
  associationDescription.value = initialAssociationDescription;
};

</script>

<style scoped>

.top-right-buttons {
  position: relative;
  text-align: right;
}

.top-right-buttons>Button {
  margin: 10px;
}

.association-header {
  width: fit-content;
  height: fit-content;
  padding-left: 50px;
  margin: 0 auto;
  display: flex;
}

.text-content {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding-right: 10px;
}
.association-title{
  font-size: 2rem;
  font-weight: bold;
}

.association-description {
  font-size: 1rem;
  font-weight: normal;
  width: 800px;
  min-width: 700px;
}
.association-description>p {
  white-space: pre-wrap;
}

.association-description>Textarea {
  height: 100%;
  width: 100%;
  border: none;
  resize: none;
}

.image-container {
  position: relative;
  height: fit-content;
  cursor: pointer;
}

.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: white;
  transition: color 0.3s ease-in-out;
  pointer-events: none;
  text-align: center;
  align-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.social-network {
  padding-top: 20px;
  display: flex;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.input-field {
  width: 100%;
  margin-bottom: 10px;
}

.add-button, .cancel-button {
  margin-left: 10px;
}

</style>