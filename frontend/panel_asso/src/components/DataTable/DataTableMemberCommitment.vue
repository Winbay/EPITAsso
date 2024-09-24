<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmPopup from 'primevue/confirmpopup'

import { onMounted, ref } from 'vue'
import CommitmentService from '@/services/association/commitment'
import type { Commitment, MemberCommitment } from '@/types/commitmentInterface'
import DialogMemberCommitment from '@/components/Dialog/DialogMemberCommitment.vue'
import { useConfirm } from 'primevue/useconfirm'
import OverlayPanel from 'primevue/overlaypanel'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'
import SelectedAssoService from '@/services/association/selectedAsso'
import MemberCommitmentUpdateService from '@/services/association/memberCommitmentUpdate'

const confirm = useConfirm()

const toast = useToast()
const commitmentService: CommitmentService = new CommitmentService(
  toast,
  +SelectedAssoService.getAssociationId()
)

const memberCommitmentUpdateService: MemberCommitmentUpdateService =
  new MemberCommitmentUpdateService(toast, +SelectedAssoService.getAssociationId())

const loading = ref(false)

const rowsPerPage = ref(5)
const currentPage = ref(0)

const handlePageChange = async (event: { page: number; rows: number }) => {
  currentPage.value = event.page
  rowsPerPage.value = event.rows
  await fetchOfficeCommitments()
}

const overlayPanelRef = ref<OverlayPanel>()
const dateRangeDefault: [Date, Date] = [new Date(), new Date()]
const dateRange = ref<[Date, Date]>(dateRangeDefault)

const openOverlayPanel = (event: Event): void => {
  if (overlayPanelRef.value) {
    overlayPanelRef.value.toggle(event)
  }
}

const resetOverlayPanel = (): void => {
  dateRange.value = dateRangeDefault
  overlayPanelRef.value?.hide()
}

const createdCommitmentRef = ref<Commitment | null>(null)
const memberCommitmentsRef = ref<MemberCommitment[]>([])

const createCommitment = async () => {
  loading.value = true
  try {
    if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
      return
    }
    const [startDate, endDate] = dateRange.value
    createdCommitmentRef.value = await commitmentService.createCommitment(startDate, endDate)
    commitmentsRef.value.unshift(createdCommitmentRef.value)
    memberCommitmentsRef.value = createdCommitmentRef.value.memberCommitments

    resetOverlayPanel()
    visibleDialogRef.value = true
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

const updateMemberCommitment = async (
  memberCommitments: MemberCommitment[],
  originalCommitments: MemberCommitment[]
) => {
  const modifiedMemberCommitments = memberCommitments.filter((commitment, index) => {
    return JSON.stringify(commitment) !== JSON.stringify(originalCommitments[index])
  })
  try {
    if (modifiedMemberCommitments.length > 0) {
      const results: MemberCommitment[] =
        await memberCommitmentUpdateService.updateMemberCommitment(modifiedMemberCommitments)
      memberCommitmentsRef.value.map((memberCommitment) => {
        const updatedCommitment = results.find((result) => result.id === memberCommitment.id)
        if (updatedCommitment) {
          memberCommitment.hours = updatedCommitment.hours
        }
        return memberCommitment
      })
    }
    createdCommitmentRef.value = null
    visibleDialogRef.value = false
  } catch (error) {
    console.error(error)
  }
}

const closeDialogWithoutUpdate = async () => {
  if (createdCommitmentRef.value) {
    await commitmentService.deleteCommitment(createdCommitmentRef.value.id)
    commitmentsRef.value.shift()
  }
  visibleDialogRef.value = false
}

const commitmentsRef = ref<Commitment[]>([])
const visibleDialogRef = ref(false)

const fetchOfficeCommitments = async () => {
  loading.value = true
  try {
    // TODO: Implement pagination
    const offset = currentPage.value * rowsPerPage.value
    commitmentsRef.value = await commitmentService.getCommitments()
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

const editCommitment = async (commitment: Commitment) => {
  memberCommitmentsRef.value = commitment.memberCommitments
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
      await deleteCommitment(commitmentId)
    }
  })
}

const deleteCommitment = async (commitmentId: number) => {
  try {
    await commitmentService.deleteCommitment(commitmentId)
    commitmentsRef.value = commitmentsRef.value.filter(commitment => commitment.id !== commitmentId);
  } catch (error) {
    console.error(error)
  }
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
  <div class="flex flex-col gap-4">
    <Button
      label="Ajouter un engagement"
      icon="pi pi-plus"
      class="add-btn w-fit"
      @click="openOverlayPanel($event)"
    />
    <div v-if="commitmentsRef.length === 0">Aucun engagement de bureau</div>
    <div v-else>
      <DataTable
        :value="commitmentsRef"
        showGridlines
        striped-rows
        :loading="loading"
        tableStyle="min-width: 50rem"
        size="small"
        paginator
        :rows="rowsPerPage"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePageChange($event)"
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
                @click="editCommitment(slotProps.data)"
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
    </div>
  </div>

  <OverlayPanel ref="overlayPanelRef">
    <div class="flex flex-col gap-4">
      <span>Sélection de la période</span>
      <Calendar
        v-model="dateRange"
        selectionMode="range"
        placeholder="Sélectionnez une période"
        showIcon
        dateFormat="dd/mm/yy"
        :hide-on-range-selection="true"
      />
      <Button
        icon="pi pi-plus"
        class="add-btn px-4 h-full"
        label="Créer"
        @click="createCommitment"
        :disabled="!dateRange || !dateRange[0] || !dateRange[1]"
      />
    </div>
  </OverlayPanel>

  <DialogMemberCommitment
    v-if="visibleDialogRef"
    v-model:visible="visibleDialogRef"
    :member-commitments="memberCommitmentsRef"
    :commitment-service="commitmentService"
    @update-member-commitments="updateMemberCommitment"
    @close-dialog-without-update="closeDialogWithoutUpdate"
  />
</template>

<style scoped>
.add-btn {
  color: white;
}
</style>
