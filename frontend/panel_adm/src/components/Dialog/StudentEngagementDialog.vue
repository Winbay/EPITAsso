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
import { useToast } from 'primevue/usetoast'
import { defineEmits, ref, watch } from 'vue'
import { type Status, type StudentEngagement } from '@/types/studentEngagementInterface'
import axios from 'axios'
import Tag from 'primevue/tag'

const toast = useToast()

const props = defineProps<{
  visible: boolean
  studentId: number | null
  canEdit: boolean
  status: Status[]
}>()

const emits = defineEmits(['update:visible', 'update:student-engagement'])

const hideDialog = () => {
  studentEngagementUtils.reset()
  emits('update:visible', { visible: false, id: null, canEdit: true })
}

const getStatusName = (statusId: number): string => {
  return props.status.find((item) => item.id === statusId)?.name ?? ''
}

const getStatusSeverity = (status: number) => {
  switch (status) {
    case 1:
      return 'warning'
    case 2:
    case 3:
      return 'success'
    case 4:
      return 'danger'
    default:
      return ''
  }
}

async function loadStudentEngagement() {
  if (!props.visible || props.studentId === null) {
    return
  }
  try {
    const response = await axios.get<StudentEngagement>(
      `/api/studentEngagements/${props.studentId}`
    )
    studentEngagementUtils.set(response.data)
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Engagements étudiant',
      detail: "L'engagement étudiant n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

const studentEngagement = ref<StudentEngagement>({
  id: -1,
  login: '',
  name: '',
  firstname: '',
  promotion: '',
  position: -1,
  comment: '',
  activities: [{ text: '', hours: null }],
  totalHours: 0,
  totalDays: 0,
  status: { id: -1, comment: '' }
})

const positions = ref([
  { name: 'Membre', code: 1 },
  { name: 'Président', code: 2 },
  { name: 'Vice-président', code: 3 },
  { name: 'Secrétaire', code: 4 },
  { name: 'Trésorier', code: 5 }
])
const selectedPosition = ref<{ name: string; code: number } | undefined>(undefined)

const studentEngagementUtils = {
  reset() {
    studentEngagement.value = {
      id: -1,
      login: '',
      name: '',
      firstname: '',
      promotion: '',
      position: -1,
      comment: '',
      activities: [{ text: '', hours: null }],
      totalHours: 0,
      totalDays: 0,
      status: { id: -1, comment: '' }
    }
    selectedPosition.value = undefined
  },
  set(value: StudentEngagement) {
    studentEngagement.value = { ...value }
    selectedPosition.value = positions.value.find((position) => position.code === value.position)
  },
}

watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      await loadStudentEngagement()
    }
  }
)

const submit = (validate: boolean) => {
  studentEngagement.value.activities = studentEngagement.value.activities.filter(
    (activity) => activity.text !== '' && activity.hours !== 0
  )
  const totalHours = studentEngagement.value.activities.reduce((acc, activity) => {
    if (activity.hours === null || isNaN(activity.hours)) {
      return acc
    }
    return acc + parseInt(String(activity.hours))
  }, 0)
  if (selectedPosition.value !== undefined) {
    studentEngagement.value.position = selectedPosition.value.code
  }
  const body = {
    ...studentEngagement.value,
    totalHours,
    totalDays: totalHours === 0 ? 0 : Math.floor(totalHours / 7 + 1),
    status: { id: validate ? 2 : 4, comment: (studentEngagement.value.status.comment === '') ? 'Aucun commentaire' : studentEngagement.value.status.comment}
  }
  emits('update:student-engagement', body)
  hideDialog()
}
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
          :value="getStatusName(studentEngagement.status.id)"
          :severity="getStatusSeverity(studentEngagement.status.id)"
        />
        <FloatLabel
          class="flex justify-center mt-8"
        >
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
            :options="positions"
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
        style="margin-right: auto;"
        @click="submit(false)"
      />
      <Button
        label="Annuler"
        class="mx-2"
        severity="secondary"
        @click="hideDialog"
      />
      <Button label="Valider" icon="pi pi-check" class="mx-2" severity="success" @click="submit(true)" />
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