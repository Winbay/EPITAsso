<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { defineEmits, ref, watch } from 'vue'
import {
  type Position,
  type Status,
  StatusEnum,
  type StudentEngagement
} from '@/types/studentEngagementInterface'
import Tag from 'primevue/tag'
import { getDefaultStudentEngagement, getStatusSeverity } from '@/utils/studentEngagementUtils'

const props = defineProps<{
  visible: boolean
  student: StudentEngagement | null
  canEdit: boolean
  status: Status[]
  positions: Position[]
}>()

const emits = defineEmits(['update:visible', 'update:student-engagement'])

const hideDialog = () => {
  resetDialog()
  emits('update:visible', { visible: false, student: null, canEdit: true })
}

const studentEngagement = ref<StudentEngagement>(getDefaultStudentEngagement())

function getDropdownPositionsValue(): { name: string; code: number }[] {
  return props.positions.map((position) => {
    return { name: position.name, code: position.id }
  })
}
const selectedPosition = ref<{ name: string; code: number } | undefined>(undefined)

function resetDialog() {
  studentEngagement.value = getDefaultStudentEngagement()
  selectedPosition.value = undefined
}
function setDialog() {
  if (props.student === null) {
    resetDialog()
    return
  }
  studentEngagement.value = JSON.parse(JSON.stringify(props.student))
  selectedPosition.value = {
    name: props.student.position.name,
    code: props.student.position.id
  }
}

const submit = (isValid: boolean) => {
  const totalHours = studentEngagement.value.activities.reduce(
    (acc, activity) => acc + activity.hours,
    0
  )
  if (selectedPosition.value !== undefined) {
    studentEngagement.value.position = {
      id: selectedPosition.value.code,
      name: selectedPosition.value.name
    }
  }
  const body = {
    ...studentEngagement.value,
    totalHours,
    status: {
      name: isValid ? StatusEnum.VALIDATED : StatusEnum.REFUSED,
      comment:
        studentEngagement.value.status.comment === ''
          ? 'Aucun commentaire'
          : studentEngagement.value.status.comment
    }
  }
  emits('update:student-engagement', body)
  hideDialog()
}

watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      setDialog()
    }
  }
)
</script>

<template>
  <Dialog
    class="w-fit"
    :visible="visible"
    :header="canEdit ? 'Ajout d\'un engagement étudiant' : 'Détails'"
    modal
    @update:visible="hideDialog"
  >
    <div class="pl-5 pr-5 pb-5" :class="{ disabled: !canEdit }">
      <div class="mb-8">
        <Tag
          :value="studentEngagement.status.name"
          :severity="getStatusSeverity(studentEngagement.status)"
        />
        <FloatLabel class="flex justify-center mt-8">
          <Textarea
            v-model="studentEngagement.status.comment"
            rows="2"
            cols="30"
            class="w-full"
            autoResize
          />
          <label for="commentaire">Commentaire de l'administration</label>
        </FloatLabel>
        <Divider v-show="studentEngagement.status.comment !== ''" />
      </div>
      <div class="flex justify-center">
        <FloatLabel>
          <InputText id="login" v-model="studentEngagement.login" />
          <label for="login">Login</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-6">
        <FloatLabel class="w-1/2">
          <InputText id="nom" v-model="studentEngagement.name" />
          <label for="nom">Nom</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <InputText id="prenom" v-model="studentEngagement.firstname" class="w-full" />
          <label for="prenom">Prénom</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-6">
        <FloatLabel class="w-1/2">
          <InputText id="promotion" v-model="studentEngagement.promotion" />
          <label for="promotion">Promotion</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <Dropdown
            id="poste"
            v-model="selectedPosition"
            :options="getDropdownPositionsValue()"
            optionLabel="name"
            class="w-full"
          />
          <label for="poste">Poste dans l'association</label>
        </FloatLabel>
      </div>
      <FloatLabel class="flex justify-center mt-8">
        <Textarea
          v-model="studentEngagement.comment"
          rows="5"
          cols="30"
          class="w-full"
          autoResize
        />
        <label for="commentaire">Commentaire sur l'investissement au sein de l'association</label>
      </FloatLabel>
      <Panel
        v-for="(activity, index) in studentEngagement.activities"
        :key="index"
        class="mt-5"
        :header="'Activité ' + (index + 1)"
        toggleable
      >
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText :id="'activite' + index + '.text'" v-model="activity.text" />
            <label :for="'activite' + index + '.text'">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber
              :id="'activite' + index + '.heures'"
              v-model="activity.hours"
              inputId="minmax-buttons"
              :min="1"
              :max="999"
              mode="decimal"
              :show-buttons="canEdit"
            />
            <label :for="'activite' + index + '.heures'">Heures travaillées</label>
          </FloatLabel>
        </div>
      </Panel>
    </div>
    <div class="flex justify-end mt-5" v-show="canEdit">
      <Button
        label="Refuser"
        icon="pi pi-times"
        class="mx-2"
        severity="danger"
        style="margin-right: auto"
        @click="submit(false)"
      />
      <Button label="Annuler" class="mx-2" severity="secondary" @click="hideDialog" />
      <Button
        label="Valider"
        icon="pi pi-check"
        class="mx-2"
        severity="success"
        @click="submit(true)"
      />
    </div>
  </Dialog>
</template>

<style>
.disabled {
  input,
  textarea,
  .p-dropdown {
    pointer-events: none;
    opacity: 0.4;
  }
}
</style>
