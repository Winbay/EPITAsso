<script setup lang="ts">
import { ref } from 'vue'
import DataTableCommitmentResume from '@/components/DataTable/DataTableCommitmentResume.vue'
import type { Commitment, MemberCommitment } from '@/types/commitmentInterface'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import OverlayPanel from 'primevue/overlaypanel'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'
import CommitmentService from '@/services/association/commitment'
import SelectedAssoService from '@/services/association/selectedAsso'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import MemberCommitmentUpdateService from '@/services/association/memberCommitmentUpdate'

const toast = useToast()
const commitmentService: CommitmentService = new CommitmentService(
  toast,
  +SelectedAssoService.getAssociationId()
)

const memberCommitmentUpdateService: MemberCommitmentUpdateService =
  new MemberCommitmentUpdateService(toast, +SelectedAssoService.getAssociationId())

const visibleDialogRef = ref(false)
const loading = ref(false)

const createdCommitmentRef = ref<Commitment>()
const memberCommitments = ref<MemberCommitment[]>([])
const originalMemberCommitments = ref<MemberCommitment[]>([])

const overlayPanelRef = ref<OverlayPanel>()
const dateRange = ref<[Date, Date]>([new Date(), new Date()])

const openOverlayPanel = async (event: Event): Promise<void> => {
  if (overlayPanelRef.value) {
    overlayPanelRef.value.toggle(event)
  }
}

const openCommitmentDialog = async () => {
  try {
    if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
      return
    }
    const [startDate, endDate] = dateRange.value
    createdCommitmentRef.value = await commitmentService.createCommitment(startDate, endDate)
    memberCommitments.value = createdCommitmentRef.value.memberCommitments
    originalMemberCommitments.value = JSON.parse(JSON.stringify(memberCommitments.value))
    overlayPanelRef.value?.hide()
    dateRange.value = [new Date(), new Date()]
    visibleDialogRef.value = true
  } catch (error) {
    console.error(error)
  }
}

const updateMemberCommitment = async () => {
  const modifiedMemberCommitments = memberCommitments.value.filter((commitment, index) => {
    return JSON.stringify(commitment) !== JSON.stringify(originalMemberCommitments.value[index])
  })
  try {
    loading.value = true
    if (modifiedMemberCommitments.length > 0) {
      await memberCommitmentUpdateService.updateMemberCommitment(modifiedMemberCommitments)
    }
    loading.value = false
    closeDialog()
  } catch (error) {
    console.error(error)
  }
}

const closeDialog = () => {
  visibleDialogRef.value = false
}

const closeDialogWithoutUpdate = async () => {
  if (createdCommitmentRef.value) {
    await commitmentService.deleteCommitment(createdCommitmentRef.value.id)
  }
  visibleDialogRef.value = false
}
</script>

<template>
  <div class="card w-full h-full px-10 py-8">
    <div class="h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Engagement Étudiant</span>
      <Button
        label="Ajouter un engagement"
        class="add-btn py-0 px-4 h-full"
        @click="openOverlayPanel($event)"
      />
    </div>

    <DataTableCommitmentResume v-if="!loading" />

    <OverlayPanel ref="overlayPanelRef">
      <div class="flex flex-col gap-4">
        <span>Sélection de la période</span>
        <Calendar
          v-model="dateRange"
          selectionMode="range"
          placeholder="Sélectionnez une période"
          showIcon
        />
        <Button
          icon="pi pi-plus"
          class="add-btn px-4 h-full"
          label="Créer"
          @click="openCommitmentDialog"
          :disabled="!dateRange || !dateRange[0] || !dateRange[1]"
        />
      </div>
    </OverlayPanel>

    <Dialog
      modal
      v-model:visible="visibleDialogRef"
      @update:visible="closeDialog"
      :style="{ width: '40vw' }"
    >
      <template #header>
        <h2 class="m-0 font-semibold text-xl text-primary">Nouvel engagement</h2>
      </template>

      <Listbox
        :options="memberCommitments"
        optionLabel="member.login"
        filter
        filterPlaceholder="Rechercher un engagement"
        emptyFilterMessage="Aucun engagement trouvé"
      >
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <div>{{ slotProps.option.member.login }}</div>
            <InputNumber
              id="hoursInput"
              v-model="slotProps.option.hours"
              :value="slotProps.option.hours || 0"
              type="number"
              :min="0"
              showButtons
              :step="1"
              suffix=" h"
            />
          </div>
        </template>
      </Listbox>
      <template #footer>
        <Button
          label="Annuler"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="closeDialogWithoutUpdate"
        />
        <Button
          label="Mettre à jour"
          icon="pi pi-check"
          class="p-button-success"
          @click="updateMemberCommitment"
        />
      </template>
    </Dialog>
  </div>
</template>

<style>
.add-btn {
  color: white;
}
</style>
