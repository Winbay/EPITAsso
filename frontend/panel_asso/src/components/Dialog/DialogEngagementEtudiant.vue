<script setup lang="ts">

import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { defineProps, defineEmits, ref, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emits = defineEmits(['update:visible', 'add:add-engagement-etudiant'])
const hideDialog = () => {
  resetDialog();
  emits('update:visible', false);
}

const resetDialog = () => {
  login.value = '';
  nom.value = '';
  prenom.value = '';
  promotion.value = '';
  selectedPoste.value = undefined;
  commentaire.value = '';
  activites.value = [
    { text: '', heures: "0" },
    { text: '', heures: "0" },
    { text: '', heures: "0" }
  ];
  totalHeures.value = '';
  totalJour.value = '';
}

const login = ref('');
const nom = ref('');
const prenom = ref('');
const promotion = ref('');
const commentaire = ref('');
const activites = ref<Activite[]>([
  { text: '', heures: "0" },
  { text: '', heures: "0" },
  { text: '', heures: "0" }
]);
const totalHeures = ref('');
const totalJour = ref('');
const selectedPoste = ref();
const postes = ref(
  [
    { name: 'Membre', code: '1' },
    { name: 'Poste 2', code: '2' },
    { name: 'Poste 3', code: '3' },
    { name: 'Poste 4', code: '4' }
  ]
);

interface Activite {
  text: string;
  heures: string;
}

watch(activites, (newValue) => {
  const total = newValue.reduce((acc, activite) => acc + parseInt(activite.heures), 0);
  totalHeures.value = total.toString();
  totalJour.value = Math.floor(total / 7).toString();
}, { deep: true});

const submit = () => {
  activites.value = activites.value.filter(activite => activite.text !== '' && activite.heures !== '0');
  emits('add:add-engagement-etudiant', {
    login: login.value,
    nom: nom.value,
    prenom: prenom.value,
    promotion: promotion.value,
    poste: selectedPoste.value.name,
    commentaire: commentaire.value,
    activites: activites.value,
    totalHeures: totalHeures.value,
    totalJour: totalJour.value
  })
  hideDialog();
}

const isFormValid = computed(() => {
  return !(login.value === '' || nom.value === '' || prenom.value === '' || promotion.value === '' || selectedPoste.value === undefined);
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
          <InputText id="login" v-model="login" />
          <label for="login">Login</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="nom" v-model="nom" />
          <label for="nom">Nom</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <InputText id="prenom" v-model="prenom" class="w-full"/>
          <label for="prenom">Prénom</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="promotion" v-model="promotion" />
          <label for="promotion">Promotion</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <Dropdown id="poste" v-model="selectedPoste" :options="postes" optionLabel="name" class="w-full"/>
          <label for="poste">Poste dans l'association</label>
        </FloatLabel>
      </div>
      <FloatLabel class="flex justify-center mt-8">
        <Textarea v-model="commentaire" rows="5" cols="30" class="w-full"/>
        <label for="commentaire">Commentaire sur l'investissement au sein de l'association</label>
      </FloatLabel>
      <Panel class="mt-5" header="Activité 1" toggleable>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite1.text" v-model="activites[0].text" />
            <label for="activite1.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite1.heures" v-model="activites[0].heures" min="0"/>
            <label for="activite1.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 2" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite2.text" v-model="activites[1].text" />
            <label for="activite2.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite2.heures" v-model="activites[1].heures" min="0"/>
            <label for="activite2.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 3" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite3.text" v-model="activites[2].text" />
            <label for="activite3.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite3.heures" v-model="activites[2].heures" min="0"/>
            <label for="activite3.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <div class="flex justify-center gap-5 mt-8">
        <FloatLabel>
          <InputText type="number" id="totalHeures" v-model="totalHeures" min="0"/>
          <label for="totalHeures">Total heures</label>
        </FloatLabel>
        <FloatLabel>
          <InputText type="number" id="totalJour" v-model="totalJour" min="0"/>
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