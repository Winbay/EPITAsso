<script setup lang="ts">
import { ref } from 'vue'
import DataTableCommitmentResume from '@/components/DataTable/DataTableCommitmentResume.vue'
import type { Commitment, MemberCommitment } from '@/types/commitmentInterface'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'
import CommitmentService from '@/services/association/commitment'
import SelectedAssoService from '@/services/association/selectedAsso'
import MemberCommitmentUpdateService from '@/services/association/memberCommitmentUpdate'
import DataTableMemberCommitment from '@/components/DataTable/DataTableMemberCommitment.vue'
import DialogMemberCommitment from '@/components/Dialog/DialogMemberCommitment.vue'

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
const memberCommitmentsRef = ref<MemberCommitment[]>([])
const originalMemberCommitmentsRef = ref<MemberCommitment[]>([])

const overlayPanelRef = ref<OverlayPanel>()
const dateRange = ref<[Date, Date]>([new Date(), new Date()])

const openOverlayPanel = async (event: Event): Promise<void> => {
  if (overlayPanelRef.value) {
    overlayPanelRef.value.toggle(event)
  }
}

const openCommitmentDialog = async () => {
  loading.value = true
  try {
    if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
      return
    }
    const [startDate, endDate] = dateRange.value
    createdCommitmentRef.value = await commitmentService.createCommitment(startDate, endDate)
    memberCommitmentsRef.value = createdCommitmentRef.value.memberCommitments
    originalMemberCommitmentsRef.value = JSON.parse(JSON.stringify(memberCommitmentsRef.value))
    overlayPanelRef.value?.hide()
    dateRange.value = [new Date(), new Date()]
    visibleDialogRef.value = true
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

const updateMemberCommitment = async (memberCommitments: MemberCommitment[], originalCommitments: MemberCommitment[]) => {
  const modifiedMemberCommitments = memberCommitments.filter((commitment, index) => {
    return JSON.stringify(commitment) !== JSON.stringify(originalCommitments[index])
  })
  try {
    loading.value = true
    if (modifiedMemberCommitments.length > 0) {
      await memberCommitmentUpdateService.updateMemberCommitment(modifiedMemberCommitments)
    }
    loading.value = false
    visibleDialogRef.value = false
  } catch (error) {
    console.error(error)
  }
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

    <div class="flex flex-col mb-5">
      <span class="text-xl font-semibold mb-2">Liste des Engagements de Bureau</span>
      <DataTableMemberCommitment
        v-if="!loading"
        :commitment-service="commitmentService"
        :update-member-commitment="updateMemberCommitment"
      />
    </div>
    <div class="flex flex-col pb-5">
      <span class="text-xl font-semibold mb-2">Résumé des engagements</span>
      <DataTableCommitmentResume v-if="!loading" />
    </div>

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

    <DialogMemberCommitment
      v-model:visible="visibleDialogRef"
      :member-commitments="memberCommitmentsRef"
      :commitment-service="commitmentService"
      :original-member-commitments="originalMemberCommitmentsRef"
      @update-member-commitments="updateMemberCommitment"
      @close-dialog-without-update="closeDialogWithoutUpdate"
    />
  </div>
</template>

<style>
.add-btn {
  color: white;
}
</style>
