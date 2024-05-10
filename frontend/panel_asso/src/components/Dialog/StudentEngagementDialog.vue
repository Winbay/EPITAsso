<script setup lang="ts">

import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { defineEmits, ref, computed, watch, reactive } from 'vue'
import { type StudentEngagement, type Position } from '@/types/studentEngagementInterface'

const props = defineProps<{
  visible: boolean
  positions: Position[]
}>()

const emits = defineEmits(['update:visible', 'add:add-engagement-etudiant'])
const hideDialog = () => {
  resetDialog();
  emits('update:visible', false);
}

const engagementetudiant = reactive<StudentEngagement>({
  id: -1,
  login: '',
  name: '',
  firstname: '',
  promotion: '',
  position: -1,
  comment: '',
  activities: [
    { text: '', hours: null },
    { text: '', hours: null },
    { text: '', hours: null }
  ],
  totalHours: null,
  totalDays: null
});

const resetDialog = () => {
  engagementetudiant.login = '';
  engagementetudiant.name = '';
  engagementetudiant.firstname = '';
  engagementetudiant.promotion = '';
  engagementetudiant.position = -1;
  engagementetudiant.comment = '';
  engagementetudiant.activities = [
    { text: '', hours: null },
    { text: '', hours: null },
    { text: '', hours: null }
  ];
  engagementetudiant.totalHours = null;
  engagementetudiant.totalDays = null;
}

const postes = ref(
  [
    { name: 'Membre', code: 1 },
    { name: 'Président', code: 2 },
    { name: 'Vice-président', code: 3 },
    { name: 'Secrétaire', code: 4 },
    { name: 'Trésorier', code: 5 },
  ]
);
const selectedPoste = ref(null);

watch(engagementetudiant.activities, (newValue) => {
  const total = newValue.reduce((acc, activite) => {
    if (activite.hours === null || isNaN(activite.hours)) {
      return acc;
    }
    return acc + parseInt(String(activite.hours));
  }, 0);
  engagementetudiant.totalHours = total;
  if (total === 0) {
    engagementetudiant.totalDays = 0;
    return;
  }
  engagementetudiant.totalDays = Math.floor(total / 7 + 1);
}, { deep: true});

const submit = () => {
  engagementetudiant.activities = engagementetudiant.activities.filter(activite => activite.text !== '' && activite.hours !== 0);
  const copyActivites = engagementetudiant.activities.map(activite => ({ ...activite }));
  if (selectedPoste.value !== null) {
    engagementetudiant.position = selectedPoste.value.code;
  }
  const body: StudentEngagement = {
    id: 0,
    login: engagementetudiant.login,
    name: engagementetudiant.name,
    firstname: engagementetudiant.firstname,
    promotion: engagementetudiant.promotion,
    position: engagementetudiant.position,
    comment: engagementetudiant.comment,
    activities: copyActivites,
    totalHours: engagementetudiant.totalHours,
    totalDays: engagementetudiant.totalDays
  }
  emits('add:add-engagement-etudiant', body);
  hideDialog();
}

const isFormValid = computed(() => {
  return !(engagementetudiant.login === '' || engagementetudiant.name === '' || engagementetudiant.firstname === '' || engagementetudiant.promotion === '' || selectedPoste.value === null);
})

</script>

<template>
  <Dialog
    class="w-fit"
    :visible="props.visible"
    header="Engagement étudiant"
    modal
    @update:visible="hideDialog">
    <span class="p-text-secondary block mb-5">Ajout d'un engagement étudiant</span>
    <div class="p-5">
      <div class="flex justify-center">
        <FloatLabel>
          <InputText id="login" v-model="engagementetudiant.login" />
          <label for="login">Login</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="nom" v-model="engagementetudiant.name" />
          <label for="nom">Nom</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <InputText id="prenom" v-model="engagementetudiant.firstname" class="w-full"/>
          <label for="prenom">Prénom</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="promotion" v-model="engagementetudiant.promotion" />
          <label for="promotion">Promotion</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <Dropdown id="poste" v-model="selectedPoste" :options="postes" optionLabel="name" class="w-full"/>
          <label for="poste">Poste dans l'association</label>
        </FloatLabel>
      </div>
      <FloatLabel class="flex justify-center mt-8">
        <Textarea v-model="engagementetudiant.comment" rows="5" cols="30" class="w-full"/>
        <label for="commentaire">Commentaire sur l'investissement au sein de l'association</label>
      </FloatLabel>
      <Panel class="mt-5" header="Activité 1" toggleable>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite1.text" v-model="engagementetudiant.activities[0].text" />
            <label for="activite1.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite1.heures" v-model="engagementetudiant.activities[0].hours" min="0"/>
            <label for="activite1.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 2" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite2.text" v-model="engagementetudiant.activities[1].text" />
            <label for="activite2.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite2.heures" v-model="engagementetudiant.activities[1].hours" min="0"/>
            <label for="activite2.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 3" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite3.text" v-model="engagementetudiant.activities[2].text" />
            <label for="activite3.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite3.heures" v-model="engagementetudiant.activities[2].hours" min="0"/>
            <label for="activite3.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <div class="flex justify-center gap-5 mt-8">
        <FloatLabel>
          <InputText type="number" id="totalHeures" v-model="engagementetudiant.totalHours" :min="0" />
          <label for="totalHeures">Total heures</label>
        </FloatLabel>
        <FloatLabel>
          <InputText type="number" id="totalJour" v-model="engagementetudiant.totalDays" min="0"/>
          <label for="totalJour">Total jour</label>
        </FloatLabel>
      </div>
    </div>
    <div class="flex justify-end mt-5">
      <Button label="Annuler" icon="pi pi-times" class="mx-2" severity="secondary" @click="hideDialog" />
      <Button label="Ajouter" icon="pi pi-check" class="mx-2" severity="success" :disabled="!isFormValid" @click="submit"/>
    </div>
  </Dialog>
</template>

<style scoped>

</style>