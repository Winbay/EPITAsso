<template>
  <div class="engagement-etudiant">
    <div class="header">
      <div class="flex gap-5 p-5">
        <h1 class="text-2xl font-bold">Engagement étudiant</h1>
        <Button
          class="cursor-pointer p-2"
          size="small"
          label="Ajouter un engagement étudiant"
          icon="pi pi-plus"
          @click="displayDialog = true"
          raised />
      </div>
      <DialogEngagementEtudiant :visible="displayDialog" @update:visible="setDisplayDialog" @add:add-engagement-etudiant="addEngagementEtudiant" />
    </div>
    <div class="card flex">
      <TableEngagementEtudiant :engagementetudiants="engagementetudiants" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import DialogEngagementEtudiant from '@/components/Dialog/DialogEngagementEtudiant.vue'
import TableEngagementEtudiant from '@/components/Formulaires/TableEngagementEtudiant.vue'

const displayDialog = ref(false);

const setDisplayDialog = (value: boolean) => {
  displayDialog.value = value;
}

interface activite {
  text: string;
  heures: string;
}

interface EngagementEtudiant {
  login: string;
  nom: string;
  prenom: string;
  promotion: string;
  poste: string;
  commentaire: string;
  activites: activite[];
  totalHeures: number;
  totalJour: number;
}

const engagementetudiants = ref<EngagementEtudiant[]>([
  {
    login: 'prenom.nom@epita.fr',
    nom: 'Doe',
    prenom: 'John',
    promotion: '2024',
    poste: 'Membre',
    commentaire: 'Très investis dans l\'association',
    activites: [
      { text: 'Activité 1', heures: "10" },
      { text: 'Activité 2', heures: "5" },
      { text: 'Activité 3', heures: "3" }
    ],
    totalHeures: 0,
    totalJour: 0
  }]);

const addEngagementEtudiant = (engagementetudiant : EngagementEtudiant) => {
  engagementetudiants.value.push(engagementetudiant);
  displayDialog.value = false;
}

</script>

<style scoped>

.engagement-etudiant {
  background-color: #131923;
  padding: 20px;
  height: 100%
}

.header {
  flex-wrap: wrap;
  height: fit-content;
}


</style>
