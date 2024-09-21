<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import { computed, onMounted, ref } from 'vue'
import CommitmentService from '@/services/association/commitment'
import { useToast } from 'primevue/usetoast'
import SelectedAssoService from '@/services/association/selectedAsso'
import type { Commitment, MemberCommitment } from '@/types/commitmentInterface'
import Paginator from 'primevue/paginator'
import MemberCommitmentUpdateService from '@/services/association/memberCommitmentUpdate'

const toast = useToast()
const commitmentService: CommitmentService = new CommitmentService(
  toast,
  +SelectedAssoService.getAssociationId()
)

const memberCommitmentUpdateService: MemberCommitmentUpdateService = new MemberCommitmentUpdateService(toast, +SelectedAssoService.getAssociationId());

const commitmentsRef = ref<Commitment[]>([])
const memberCommitments = ref<MemberCommitment[]>([])
const groupedMemberCommitments = ref<{ id: number, login: string; hours: number }[]>([])

const loading = ref(true);
const visibleDialogRef = ref(false);
const selectedCommitment = ref<{ id: number, login: string; hours: number }>();
const rowsPerPage = ref(5);
const currentPage = ref(0);
const commitmentsCount = ref(0);

const groupMemberCommitments = () => {
  groupedMemberCommitments.value = memberCommitments.value.reduce(
    (acc, curr) => {
      const existing = acc.find((item) => item.login === curr.member.login)
      if (existing) {
        existing.hours += curr.hours
      } else {
        acc.push({ id: curr.id, login: curr.member.login, hours: curr.hours })
      }
      return acc
    },
    [] as { id: number, login: string; hours: number }[]
  )

  groupedMemberCommitments.value.sort((a, b) => a.login.localeCompare(b.login))
}

const fetchCommitments = async () => {
  loading.value = true
  try {
    commitmentsRef.value = await commitmentService.getCommitments()
    memberCommitments.value = commitmentsRef.value.flatMap(
      (commitment) => commitment.memberCommitments
    )
    groupMemberCommitments()
    commitmentsCount.value = groupedMemberCommitments.value.length
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const updateMemberCommitment = async () => {
  if (selectedCommitment.value && addedHours.value > 0) {
    await memberCommitmentUpdateService.updateMemberCommitment([{
      id: selectedCommitment.value.id,
      hours: selectedCommitment.value.hours + addedHours.value
    }])
  }
}

onMounted(async () => {
  await fetchCommitments()
})

const onRowSelect = (event: { data: { id: number, login: string, hours: number } }) => {
  selectedCommitment.value = event.data;
  visibleDialogRef.value = true;
};

const closeDialog = async () => {
  await updateMemberCommitment()
  visibleDialogRef.value = false;
  startDate.value = null;
  endDate.value = null;
  await fetchCommitments()
};

const columns = [
  { field: 'login', header: 'Login' },
  { field: 'hours', header: 'Nombre d’heures de bureau' }
]

const handlePageChange = async (event: { page: number; rows: number }) => {
  currentPage.value = event.page;
  rowsPerPage.value = event.rows;
  await fetchCommitments();
};

const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

const calculateAddedHours = (start: Date | null, end: Date | null): number => {
  if (start && end) {
    const diff = end.getTime() - start.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  }
  return 0;
};

const addedHours = computed(() => {
  return calculateAddedHours(startDate.value, endDate.value);
});

</script>

<template>
  <DataTable
    :value="groupedMemberCommitments"
    showGridlines
    striped-rows
    :loading="loading"
    selectionMode="single"
    tableStyle="min-width: 50rem"
    size="small"
    @row-select="onRowSelect"
  >
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
    />
  </DataTable>

  <Paginator
    class="p-paginator-bottom"
    :rows="rowsPerPage"
    :totalRecords="commitmentsCount"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="handlePageChange"
  />

  <Dialog
    modal
    v-if="selectedCommitment"
    :visible="visibleDialogRef"
    @update:visible="closeDialog"
    :style="{ width: '40vw' }">
    <template #header>
      <div class="items-center">
        <h2 class="m-0 font-semibold text-xl text-primary">{{ selectedCommitment.login }}</h2>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex gap-3 items-center justify-center pb-2">
        <label for="officeHours">Heures de bureau</label>
        <p id="officeHours" class="hours-display">
          {{ selectedCommitment.hours }} h
          <span v-if="addedHours > 0" class="added-hours">+{{ addedHours }} h</span>
        </p>
      </div>
    </div>
    <div class="flex gap-5 pl-5 pr-5">

    <div class="flex flex-col gap-3 items-center justify-center">
      <label for="startDate">Date et Heure de Début</label>
      <Calendar id="startDate" v-model="startDate" showTime />
    </div>

    <div class="flex flex-col gap-3 items-center justify-center">
      <label for="endDate">Date et Heure de Fin</label>
      <Calendar id="endDate" v-model="endDate" showTime />
    </div>
  </div>
  </Dialog>
</template>

<style>
.hours-display {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0;
}

.added-hours {
  color: gray;
  margin-left: 0.5rem;
  font-style: italic;
  font-weight: lighter;
}
</style>
