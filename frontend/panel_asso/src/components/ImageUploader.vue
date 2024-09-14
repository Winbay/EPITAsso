<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const imageUrl = ref<string | null>(null)
const file = ref<File | null>(null)

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    imageUrl.value = URL.createObjectURL(file)
    emit('update:modelValue', file)
  }
}

const removeImage = () => {
  imageUrl.value = null
  file.value = null
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg flex flex-col">
    <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" class="mb-4" />
    <div v-if="imageUrl" class="flex items-start">
      <img :src="imageUrl" alt="Preview" class="max-w-xs h-auto rounded-md shadow-md" />
      <button
        v-if="imageUrl"
        @click="removeImage"
        class="ml-4 p-1 bg-black text-white rounded-full text-lg hover:bg-red-700"
      >
        ✕
      </button>
    </div>
  </div>
</template>
