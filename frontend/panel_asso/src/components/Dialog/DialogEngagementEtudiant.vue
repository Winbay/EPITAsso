<script setup lang="ts">

import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { defineEmits, ref, computed, watch, reactive } from 'vue'
import { type EngagementEtudiant, Poste } from '@/stores/interfaceEngagementEtudiant'

const props = defineProps<{
  visible: boolean
}>()

const emits = defineEmits(['update:visible', 'add:add-engagement-etudiant'])
const hideDialog = () => {
  resetDialog();
  emits('update:visible', false);
}

const engagementetudiant = reactive<EngagementEtudiant>({
  login: '',
  nom: '',
  prenom: '',
  promotion: '',
  poste: null,
  commentaire: '',
  activites: [
    { text: '', heures: null },
    { text: '', heures: null },
    { text: '', heures: null }
  ],
  totalHeures: null,
  totalJour: null
});

const resetDialog = () => {
  engagementetudiant.login = '';
  engagementetudiant.nom = '';
  engagementetudiant.prenom = '';
  engagementetudiant.promotion = '';
  engagementetudiant.poste = null;
  engagementetudiant.commentaire = '';
  engagementetudiant.activites = [
    { text: '', heures: null },
    { text: '', heures: null },
    { text: '', heures: null }
  ];
  engagementetudiant.totalHeures = null;
  engagementetudiant.totalJour = null;
}

const postes = ref(
  [
    { name: 'Membre', code: Poste.Membre },
    { name: 'Président', code: Poste.President },
    { name: 'Vice-président', code: Poste.VicePresident },
    { name: 'Secrétaire', code: Poste.Secretaire },
    { name: 'Trésorier', code: Poste.Tresorier },
  ]
);
const selectedPoste = ref(null);

watch(engagementetudiant.activites, (newValue) => {
  console.log("activites", newValue)
  const total = newValue.reduce((acc, activite) => {
    if (activite.heures === null || isNaN(activite.heures)) {
      return acc;
    }
    return acc + parseInt(String(activite.heures));
  }, 0);
  engagementetudiant.totalHeures = total;
  if (total === 0) {
    engagementetudiant.totalJour = 0;
    return;
  }
  engagementetudiant.totalJour = Math.floor(total / 7 + 1);
}, { deep: true});

const submit = () => {
  engagementetudiant.activites = engagementetudiant.activites.filter(activite => activite.text !== '' && activite.heures !== 0);
  const copyActivites = engagementetudiant.activites.map(activite => ({ ...activite }));
  if (selectedPoste.value !== null) {
    engagementetudiant.poste = selectedPoste.value.code;
  }
  const body: EngagementEtudiant = {
    login: engagementetudiant.login,
    nom: engagementetudiant.nom,
    prenom: engagementetudiant.prenom,
    promotion: engagementetudiant.promotion,
    poste: engagementetudiant.poste,
    commentaire: engagementetudiant.commentaire,
    activites: copyActivites,
    totalHeures: engagementetudiant.totalHeures,
    totalJour: engagementetudiant.totalJour
  }
  emits('add:add-engagement-etudiant', body);
  hideDialog();
}

const isFormValid = computed(() => {
  return !(engagementetudiant.login === '' || engagementetudiant.nom === '' || engagementetudiant.prenom === '' || engagementetudiant.promotion === '' || selectedPoste.value === null);
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
          <InputText id="nom" v-model="engagementetudiant.nom" />
          <label for="nom">Nom</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <InputText id="prenom" v-model="engagementetudiant.prenom" class="w-full"/>
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
        <Textarea v-model="engagementetudiant.commentaire" rows="5" cols="30" class="w-full"/>
        <label for="commentaire">Commentaire sur l'investissement au sein de l'association</label>
      </FloatLabel>
      <Panel class="mt-5" header="Activité 1" toggleable>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite1.text" v-model="engagementetudiant.activites[0].text" />
            <label for="activite1.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite1.heures" v-model="engagementetudiant.activites[0].heures" min="0"/>
            <label for="activite1.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 2" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite2.text" v-model="engagementetudiant.activites[1].text" />
            <label for="activite2.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite2.heures" v-model="engagementetudiant.activites[1].heures" min="0"/>
            <label for="activite2.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <Panel class="mt-2" header="Activité 3" toggleable collapsed>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText id="activite3.text" v-model="engagementetudiant.activites[2].text" />
            <label for="activite3.text">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" id="activite3.heures" v-model="engagementetudiant.activites[2].heures" min="0"/>
            <label for="activite3.heures">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
      <div class="flex justify-center gap-5 mt-8">
        <FloatLabel>
          <InputText type="number" id="totalHeures" v-model="engagementetudiant.totalHeures" :min="0" />
          <label for="totalHeures">Total heures</label>
        </FloatLabel>
        <FloatLabel>
          <InputText type="number" id="totalJour" v-model="engagementetudiant.totalJour" min="0"/>
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