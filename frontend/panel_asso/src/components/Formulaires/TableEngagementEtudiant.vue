<script setup lang="ts">

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

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

const props = defineProps<{
  engagementetudiants: EngagementEtudiant[]
}>()

</script>

<template>
  <DataTable :value="engagementetudiants">
    <Column field="login" header="Login" :sortable="true"></Column>
    <Column field="nom" header="Nom" :sortable="true"></Column>
    <Column field="prenom" header="Prénom" :sortable="true"></Column>
    <Column field="promotion" header="Promotion" :sortable="true"></Column>
    <Column field="poste" header="Poste dans l'association" :sortable="true"></Column>
    <Column field="commentaire" header="Commentaire sur l'investissement au sein de l'association"></Column>
    <Column field="activite1" header="Activité 1 et heures travaillées">
      <template #body="slotProps">
        {{ slotProps.data.activites[0].text + " = " + slotProps.data.activites[0].heures + " h"}}
      </template>
    </Column>
    <Column field="activite2" header="Activité 2 et heures travaillées">
      <template #body="slotProps">
        {{
          (slotProps.data.activites.length > 1) ?
          slotProps.data.activites[1].text + " = " + slotProps.data.activites[1].heures + " h" :
          ""
        }}
      </template>
    </Column>
    <Column field="activite3" header="Activité 3 et heures travaillées">
      <template #body="slotProps">
        {{
          (slotProps.data.activites.length > 2) ?
            slotProps.data.activites[2].text + " = " + slotProps.data.activites[2].heures + " h" :
            ""
        }}
      </template>
    </Column>
    <Column field="totalHeures" header="Total heures" :sortable="true">
    </Column>
    <Column field="totalJour" header="Total jour" :sortable="true"></Column>
  </DataTable>
</template>

<style scoped>

</style>