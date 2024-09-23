<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmPopup from 'primevue/confirmpopup'

import { onMounted, type PropType, ref } from 'vue'
import type CommitmentService from '@/services/association/commitment'
import type { Commitment, MemberCommitment } from '@/types/commitmentInterface'
import Paginator from 'primevue/paginator'
import DialogMemberCommitment from '@/components/Dialog/DialogMemberCommitment.vue'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const props = defineProps({
  commitmentService: {
    type: Object as PropType<CommitmentService>,
    required: true
  },
  updateMemberCommitment: {
    type: Function as PropType<
      (memberCommitments: MemberCommitment[], originalCommitments: MemberCommitment[]) => void
    >,
    required: true
  }
})

const loading = ref(false)

const rowsPerPage = ref(5)
const currentPage = ref(0)
const officeCommitmentsCount = ref(0)

const handlePageChange = async (event: { page: number; rows: number }) => {
  currentPage.value = event.page
  rowsPerPage.value = event.rows
  await fetchOfficeCommitments()
}

const officeCommitmentsRef = ref<Commitment[]>([])
const memberCommitmentsRef = ref<MemberCommitment[]>([])
const originalMemberCommitmentsRef = ref<MemberCommitment[]>([])
const visibleDialogRef = ref(false)

const fetchOfficeCommitments = async () => {
  loading.value = true
  try {
    officeCommitmentsRef.value = await props.commitmentService?.getCommitments()
    officeCommitmentsCount.value = officeCommitmentsRef.value.length
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

const editBureauCommitment = async (commitment: Commitment) => {
  memberCommitmentsRef.value = commitment.memberCommitments
  originalMemberCommitmentsRef.value = JSON.parse(JSON.stringify(memberCommitmentsRef.value))
  visibleDialogRef.value = true
}

const confirmDelete = (event: Event, commitmentId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Êtes-vous sûr de vouloir supprimer cet engagement ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteBureauCommitment(commitmentId)
    }
  })
}

const deleteBureauCommitment = async (commitmentId: number) => {
  try {
    await props.commitmentService?.deleteCommitment(commitmentId)
    await fetchOfficeCommitments()
  } catch (error) {
    console.error(error)
  }
}

const closeDialogWithoutUpdate = async () => {
  visibleDialogRef.value = false
  await fetchOfficeCommitments()
}

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(async () => {
  await fetchOfficeCommitments()
})
</script>

<template>
  <div class="flex">
    <div v-if="officeCommitmentsRef.length === 0">Aucun engagement de bureau</div>
    <div v-else>
      <DataTable
        :value="officeCommitmentsRef"
        showGridlines
        striped-rows
        :loading="loading"
        tableStyle="min-width: 50rem"
        size="small"
      >
        <Column field="startDate" header="Date de début">
          <template #body="{ data, field }">
            {{ formatDateTime(data[field]) }}
          </template>
        </Column>
        <Column field="endDate" header="Date de fin">
          <template #body="{ data, field }">
            {{ formatDateTime(data[field]) }}
          </template>
        </Column>
        <Column header="Actions" body="(rowData)">
          <template #body="slotProps">
            <div class="actions">
              <Button
                icon="pi pi-pen-to-square"
                @click="editBureauCommitment(slotProps.data)"
                v-tooltip="'Editer l\'engagement'"
              />
              <ConfirmPopup></ConfirmPopup>
              <Button
                icon="pi pi-trash"
                @click="confirmDelete($event, slotProps.data.id)"
                v-tooltip="'Supprimer l\'engagement'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
        class="p-paginator-bottom"
        :rows="rowsPerPage"
        :totalRecords="officeCommitmentsCount"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePageChange"
      />

      <DialogMemberCommitment
        v-model:visible="visibleDialogRef"
        :commitment-service="commitmentService"
        :member-commitments="memberCommitmentsRef"
        :original-member-commitments="originalMemberCommitmentsRef"
        @update-member-commitments="updateMemberCommitment"
        @close-dialog-without-update="closeDialogWithoutUpdate"
      />
    </div>
  </div>
</template>

<style scoped></style>
