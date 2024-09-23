<script setup lang="ts">
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import Button from 'primevue/button'
import { type PropType, computed, ref, onMounted } from 'vue'
import type CommitmentService from '@/services/association/commitment'
import type { MemberCommitment } from '@/types/commitmentInterface'

const props = defineProps({
  commitmentService: {
    type: Object as PropType<CommitmentService>,
    required: true
  },
  memberCommitments: {
    type: Array as PropType<MemberCommitment[]>,
    required: true
  }
})

const emits = defineEmits(['updateMemberCommitments', 'closeDialogWithoutUpdate'])

const memberCommitmentsRef = ref<MemberCommitment[]>([])
const originalMemberCommitmentsRef = ref<MemberCommitment[]>([])

const sortedMemberCommitments = computed(() => {
  return [...memberCommitmentsRef.value].sort((a, b) =>
    a.member.login.localeCompare(b.member.login)
  )
})

onMounted(() => {
  memberCommitmentsRef.value = props.memberCommitments.map((commitment) => ({ ...commitment }))
  originalMemberCommitmentsRef.value = props.memberCommitments.map((commitment) => ({
    ...commitment
  }))
})
</script>

<template>
  <Dialog
    modal
    :style="{ width: '40vw' }"
    :visible="true"
    @update:visible="emits('closeDialogWithoutUpdate')"
  >
    <template #header>
      <h2 class="m-0 font-semibold text-xl text-primary">Nouvel engagement</h2>
    </template>

    <Listbox
      :options="sortedMemberCommitments"
      optionLabel="member.login"
      filter
      filterPlaceholder="Rechercher un engagement"
      emptyFilterMessage="Aucun engagement trouvé"
      class="mb-6"
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

    <div class="flex gap-4 justify-start items-center">
      <Button
        label="Annuler"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="emits('closeDialogWithoutUpdate')"
      />
      <Button
        label="Mettre à jour"
        icon="pi pi-check"
        class="p-button-success"
        @click="
          emits('updateMemberCommitments', memberCommitmentsRef, originalMemberCommitmentsRef)
        "
      />
    </div>
  </Dialog>
</template>

<style scoped></style>
