<script setup lang="ts">
import '@/fixtures/studentEngagement'
import StudentEngagementTable from '@/components/DataTable/StudentEngagementTable.vue'
import {
  type StudentEngagement,
  type Position,
  type StatusDetails,
  Status
} from '@/types/studentEngagementInterface'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import StudentEngagementDialog from '@/components/Dialog/StudentEngagementDialog.vue'
import { deepEqual } from '@/utils/studentEngagementUtils'
import * as studentEngagementServices from '@/services/studentEngagementServices'

const displayDialog = ref(false)
const studentEngagement = ref<StudentEngagement | null>(null)
const canEditDialog = ref(true)
const setDisplayDialog = (value: {
  visible: boolean
  student: StudentEngagement | null
  canEdit: boolean
}) => {
  displayDialog.value = value.visible
  studentEngagement.value = value.student
  canEditDialog.value = value.canEdit
}

const isStudentEngagementModified = (studentEngagement: StudentEngagement): boolean => {
  const student = studentEngagements.value.find((s) => s.id === studentEngagement.id)
  if (!student) {
    return false
  }
  const studentEngagementKeys = Object.keys(studentEngagement) as Array<keyof StudentEngagement>

  return !studentEngagementKeys.every((key) => {
    const studentValue = student[key]
    const engagementValue = studentEngagement[key]

    if (key === 'status') {
      return true
    }

    if (typeof studentValue === 'object' && typeof engagementValue === 'object') {
      return deepEqual(studentValue, engagementValue)
    } else {
      return studentValue === engagementValue
    }
  })
}

const toast = useToast()

const positions = ref<Position[]>([])
const status = ref<StatusDetails[]>([])
const studentEngagements = ref<StudentEngagement[]>([])

async function loadPosition() {
  return await studentEngagementServices
    .loadPosition(toast)
    .then((response) => {
      positions.value = response || []
      return response
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des positions :', error)
      return false
    })
}

async function loadStatus() {
  return await studentEngagementServices
    .loadStatus(toast)
    .then((response) => {
      status.value = response || []
      return response
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des status :', error)
      return false
    })
}

async function reloadStudentEngagements() {
  await studentEngagementServices.loadStudentEngagements(toast).then((response) => {
    if (response) {
      studentEngagements.value = response
    }
  })
}

async function updateStudentEngagement(studentEngagement: StudentEngagement) {
  if (
    studentEngagement.status.name === Status.VALIDATED &&
    isStudentEngagementModified(studentEngagement)
  ) {
    studentEngagement.status.name = Status.VALIDATED_WITH_MODIFICATIONS
  }
  await studentEngagementServices
    .updateStudentEngagement(studentEngagement, toast)
    .then((response) => {
      if (response) {
        reloadStudentEngagements()
        displayDialog.value = false
      }
    })
}

onMounted(async () => {
  if ((await loadPosition()) && (await loadStatus())) {
    await reloadStudentEngagements()
  }
})
</script>

<template>
  <div class="student-engagement">
    <div class="header">
      <div class="flex gap-5 p-5">
        <h1 class="text-2xl font-bold">Engagement étudiant</h1>
      </div>
      <StudentEngagementDialog
        :visible="displayDialog"
        :student="studentEngagement"
        :canEdit="canEditDialog"
        :status="status"
        :positions="positions"
        @update:visible="setDisplayDialog"
        @update:studentEngagement="updateStudentEngagement"
      />
    </div>
    <div class="card flex justify-center">
      <StudentEngagementTable
        :studentEngagements="studentEngagements"
        :positions="positions"
        :status="status"
        @update:visible="setDisplayDialog"
      />
    </div>
  </div>
</template>

<style scoped>
.student-engagement {
  background-color: #131923;
  padding: 20px;
  height: 100%;
}

.header {
  flex-wrap: wrap;
  height: fit-content;
}
</style>
