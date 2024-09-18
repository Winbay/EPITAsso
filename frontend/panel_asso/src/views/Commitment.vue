<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toolbar from 'primevue/toolbar';
import { FilterMatchMode } from 'primevue/api';
import Calendar from 'primevue/calendar';
import DialogStudentCommitment from '@/components/Dialog/DialogCommitment.vue'
import { useToast } from 'primevue/usetoast'
import type { CommitmentResume } from '@/types/commitmentInterface'
import SelectedAssoService from '@/services/association/selectedAsso'
import CommitmentResumeService from '@/services/commitment/resume'


const toast = useToast()
const commitmentResumeService: CommitmentResumeService = new CommitmentResumeService(toast, +SelectedAssoService.getAssociationId());

const commitmentsRef = ref<CommitmentResume[]>([]);
const filters = ref();
const loading = ref(true);
const visibleDialogRef = ref(false)
const selectedCommitmentId = ref<number>();

const fetchCommitments = async () => {
  loading.value = true;
  try {
    commitmentsRef.value = await commitmentResumeService.getCommitmentsResume(filters.value.dateRange.value[0], filters.value.dateRange.value[1], filters.value['login'].value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const initFilters = () => {
  filters.value = {
    login: { value: "", matchMode: FilterMatchMode.CONTAINS },
    dateRange: {
      value: [
        new Date(new Date().getFullYear() - 3, new Date().getMonth(), new Date().getDate()),
        new Date()
      ],
      matchMode: FilterMatchMode.BETWEEN
    }
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const closeDialog = () => {
  visibleDialogRef.value = false;
};

const columns = [
  { field: 'login', header: 'Login' },
  { field: 'lastName', header: 'Nom',  hidden: true },
  { field: 'firstName', header: 'Prénom', hidden: true },
  { field: 'commitmentHours', header: 'Nombre d’heures de bureau' },
  { field: 'eventCommitmentHours', header: 'Nombre d’heures staff' },
  { field: 'totalHours', header: 'Total' }
];

const exportCSV = () => {
  const csvContent = [
    columns.map(config => config.header).join(','),
    ...commitmentsRef.value.map(student =>
      columns.map(config => {
        const fieldPath = config.field.split('.');
        return fieldPath.reduce((acc, curr) => acc && acc[curr], student);
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'commitment.csv';
  link.click();
};

watch(() => filters.value.dateRange.value, (newVal, oldVal) => {
  if (newVal && newVal[0] && newVal[1] && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1])) {
    fetchCommitments();
  }
});

watch(() => filters.value['login'].value, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal.length % 3 === 0) {
    fetchCommitments();
  }
});

const onRowSelect = (event) => {
  selectedCommitmentId.value = event.data.id;
  visibleDialogRef.value = true;
};

onMounted(() => {
  fetchCommitments();
});
</script>

<template>
  <div class="card w-full h-full px-10 py-8">
    <div class="h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Engagement Étudiant</span>
    </div>
    <DataTable :value="commitmentsRef" paginator showGridlines :rows="10" dataKey="id" :loading="loading" selectionMode="single"
               @row-select="onRowSelect">
      <template #header>
        <Toolbar style="border: none;" class="p-0">
          <template #start>
            <Button icon="pi pi-external-link" severity="secondary" text @click="exportCSV" v-tooltip.top="'Exporter'"/>
            <Button icon="pi pi-filter-slash" severity="secondary" text @click="clearFilter" v-tooltip.top="'Réinitialiser les filtres'"/>
          </template>

          <template #center>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['login'].value" placeholder="Recherche par login" />
            </IconField>
          </template>

          <template #end>
              <Calendar v-model="filters['dateRange'].value" selectionMode="range" placeholder="Sélectionnez une période" showIcon />
          </template>
        </Toolbar>
      </template>
      <template #empty> Aucun étudiant trouvé. </template>
      <template #loading> Chargement des données des étudiants. Veuillez patienter. </template>

      <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header" :hidden="column.hidden" >
        <template v-if="column.computed" #body="slotProps">
          {{ column.computed(slotProps.data) }}
        </template>
      </Column>
    </DataTable>

    <DialogStudentCommitment
      v-if="visibleDialogRef"
      v-model:visible="visibleDialogRef"
      :set-hidden="closeDialog"
      :selected-commitment-id="selectedCommitmentId"
      :commitment-resume="commitmentsRef.find(commitment => commitment.id === selectedCommitmentId)"
    />
  </div>
</template>

<style>
.p-icon-field > .p-input-icon {
  margin-top: -0.7rem;
}
</style>
