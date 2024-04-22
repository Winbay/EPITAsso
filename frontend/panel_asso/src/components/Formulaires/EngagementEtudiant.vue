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
      <DialogEngagementEtudiant :visible="displayDialog" @update:visible="setDisplayDialog"></DialogEngagementEtudiant>
    </div>
    <div class="card flex">
      <DataTable class="table" :value="engagementetudiants">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable" />
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DialogEngagementEtudiant from '@/components/Dialog/DialogEngagementEtudiant.vue'

const displayDialog = ref(false);

const setDisplayDialog = (value: boolean) => {
  console.log(value)
  displayDialog.value = value;
}

const selectedPoste  = ref();
const postes = ref(
  [
    { name: 'Membre', code: '1' },
  ]
);

interface activite {
  text: string;
  heures: number;
}

interface engagementetudiant {
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


const engagementetudiants = ref<engagementetudiant[]>([
  {
    login: 'prenom.nom@epita.fr',
    nom: 'Doe',
    prenom: 'John',
    promotion: '2024',
    poste: 'Membre',
    commentaire: 'Très investis dans l\'association',
    activites: [
      { text: 'Activité 1', heures: 10 },
      { text: 'Activité 2', heures: 5 },
      { text: 'Activité 3', heures: 3 }
    ],
    totalHeures: 0,
    totalJour: 0
  }]);

const columns = [
  { field: 'login', header: 'Login', sortable: true},
  { field: 'nom', header: 'Nom' , sortable: true},
  { field: 'prenom', header: 'Prénom' , sortable: true},
  { field: 'promotion', header: 'Promotion' , sortable: true},
  { field: 'poste', header: 'Poste dans l\'association' , sortable: true},
  { field: 'commentaire', header: 'Commentaire sur l\'investissement au sein de l\'association' , sortable: false},
  { field: 'activite1', header: 'Activité 1 et heures travaillées' , sortable: false},
  { field: 'activite2', header: 'Activité 2 et heures travaillées' , sortable: false},
  { field: 'activite3', header: 'Activité 3 et heures travaillées' , sortable: false},
  { field: 'totalHeures', header: 'Total heures' , sortable: true},
  { field: 'totalJour', header: 'Total jour' , sortable: true},
];

const addEngagementEtudiant = () => {
  const engagementetudiant: engagementetudiant = {
    login: login.value,
    nom: nom.value,
    prenom: prenom.value,
    promotion: promotion.value,
    poste: selectedPoste.value.name,
    commentaire: commentaire.value,
    activite1: activites.value[0].text + "=" + activites.value[0].heures + "h",
    activite2: activites.value[1].text + "=" + activites.value[1].heures + "h",
    activite3: activites.value[2].text + "=" + activites.value[2].heures + "h",
    totalHeures: totalHeures.value,
    totalJour: totalJour.value
  };
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
