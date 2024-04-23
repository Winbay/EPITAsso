<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import DialogEngagementEtudiant from '@/components/Dialog/DialogEngagementEtudiant.vue'
import TableEngagementEtudiant from '@/components/Formulaires/TableEngagementEtudiant.vue'
import { type EngagementEtudiant, Poste } from '@/stores/interfaceEngagementEtudiant'

const displayDialog = ref(false);

const setDisplayDialog = (value: boolean) => {
  displayDialog.value = value;
}

const engagementetudiants = ref<EngagementEtudiant[]>([
  {
    login: 'prenom.nom@epita.fr',
    nom: 'Doe',
    prenom: 'John',
    promotion: '2024',
    poste: Poste.Membre,
    commentaire: 'Très investis dans l\'association',
    activites: [
      { text: 'Vente crepes', heures: 2 },
      { text: 'Afterwork 15/11', heures: 5 },
      { text: 'JPO 17/12', heures: 5 }
    ],
    totalHeures: 12,
    totalJour: 1
  }]);

const addEngagementEtudiant = (engagementetudiant : EngagementEtudiant) => {
  engagementetudiants.value.push(engagementetudiant);
  displayDialog.value = false;
}

</script>

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
