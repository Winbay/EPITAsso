<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Calendar from 'primevue/calendar';
import { FilterMatchMode } from 'primevue/api';

import type { CommitmentResume } from '@/types/commitmentInterface';
import CommitmentResumeService from '@/services/commitment/resume';
import SelectedAssoService from '@/services/association/selectedAsso';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const commitmentResumeService: CommitmentResumeService = new CommitmentResumeService(toast, +SelectedAssoService.getAssociationId());

const commitmentsRef = ref<CommitmentResume[]>([]);
const filters = ref({ login: { value: "", matchMode: FilterMatchMode.CONTAINS }, dateRange: { value: [new Date(new Date().getFullYear() - 3, new Date().getMonth(), new Date().getDate()), new Date()], matchMode: FilterMatchMode.BETWEEN } });
const loading = ref(true);
const rowsPerPage = ref(5);
const currentPage = ref(0);
const commitmentsCount = ref(0);

defineEmits(['rowSelect']);

const fetchCommitments = async () => {
  loading.value = true;
  try {
    const offset = currentPage.value * rowsPerPage.value;
    commitmentsRef.value = await commitmentResumeService.getCommitmentsResume(filters.value.dateRange.value[0], filters.value.dateRange.value[1], filters.value['login'].value);
    commitmentsCount.value = commitmentsRef.value.length;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const clearFilter = () => {
  filters.value.login.value = "";
  filters.value.dateRange.value = [new Date(new Date().getFullYear() - 3, new Date().getMonth(), new Date().getDate()), new Date()];
};

const columns = [
  { field: 'login', header: 'Login' },
  { field: 'lastName', header: 'Nom', hidden: true },
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
        return fieldPath.reduce((acc, curr) => (acc as any)[curr], student);
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

watch(() => filters.value.dateRange.value, async (newVal, oldVal) => {
  if (newVal && newVal[0] && newVal[1] && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1])) {
    await fetchCommitments();
  }
});

watch(() => filters.value['login'].value, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal.length % 3 === 0) {
    await fetchCommitments();
  }
});

onMounted(async () => {
  await fetchCommitments();
});

const handlePageChange = async (event: { page: number; rows: number }) => {
  currentPage.value = event.page;
  rowsPerPage.value = event.rows;
  await fetchCommitments();
};
</script>

<template>
  <DataTable
    :value="commitmentsRef"
    showGridlines
    striped-rows
    :loading="loading"
    selectionMode="single"
    tableStyle="min-width: 50rem"
    size="small"
    @row-select="$emit('rowSelect', $event)"
  >
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

    <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header" :hidden="column.hidden" >
      <template v-if="column.hidden" #body="slotProps">
        {{ slotProps.data }}
      </template>
    </Column>
  </DataTable>

  <Paginator
    class="p-paginator-bottom"
    :rows="rowsPerPage"
    :totalRecords="commitmentsCount"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="handlePageChange"
  />
</template>
