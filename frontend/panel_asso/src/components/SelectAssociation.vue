<script setup lang="ts">

import Avatar from 'primevue/avatar'
import Dropdown, { type DropdownChangeEvent } from 'primevue/dropdown'
import { type PropType, ref } from 'vue'
import type { AssociationWithLogo } from '@/types/associationInterfaces'
import { useAssociationStore } from '@/stores/selectedAssociation'
import SelectedAssoService from '@/services/association/selectedAsso'
import { emit } from '@/utils/eventBus'

defineProps({
  userAssociations: {
    type: Array as PropType<AssociationWithLogo[]>,
    required: true
  }
})

const selectedAssociation = ref<AssociationWithLogo | undefined>()

const associationStore = useAssociationStore()
const handleSelectedAssoChange = (event: DropdownChangeEvent) : void => {
  SelectedAssoService.setAssociationId(event.value.id.toString())
  if (associationStore.selectedAssociationId !== event.value.id.toString()) {
    associationStore.setSelectedAssociation(event.value.id.toString())
    emit('association-changed', event.value.id.toString())
  }
}
</script>

<template>
  <Dropdown
    v-model="selectedAssociation"
    :options="userAssociations"
    optionLabel="name"
    placeholder="Sélectionner une association"
    class="h-10 w-full md:w-14rem bg-transparent border-0 shadow-none items-center"
    @change="handleSelectedAssoChange"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex align-items-center">
        <Avatar :image="`${slotProps.value.logo}`" class="mr-1" shape="circle" />
        <div class="text-base flex items-center ml-1 mr-0">{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
            {{ slotProps.placeholder }}
          </span>
    </template>
    <template #option="slotProps">
      <div class="flex align-items-center">
        <Avatar :image="`${slotProps.option.logo}`" class="mr-1" shape="circle" />
        <div class="text-base flex items-center ml-1">{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<style>
.p-dropdown-panel .p-dropdown-items {
  padding: 0;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
  padding: 0.5rem 1.25rem;
}

.p-dropdown .p-dropdown-trigger {
  width: 2rem;
}
</style>