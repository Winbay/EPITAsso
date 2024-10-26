<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'
import type { Comment } from '@/types/commentInterfaces'

import { computed, ref } from 'vue'

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true
  },
  comment: {
    type: Object as () => Comment | null,
    default: null
  }
})

const emits = defineEmits(['post:comment', 'edit:comment', 'cancel:edit'])

const newCommentRef = ref<string>('')
const commentTextareaRef = ref<HTMLTextAreaElement>()
const isCommentEmpty = computed(() => !newCommentRef.value)

const handleInput = () => {
  newCommentRef.value = commentTextareaRef.value?.innerHTML ?? ''
  resizeTextarea()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submitComment()
  }
}

const submitComment = () => {
  if (props.isEditing) {
    editComment()
  } else {
    addComment()
  }
  resetInput()
  resizeTextarea()
}

const addComment = () => {
  if (newCommentRef.value.trim()) {
    emits('post:comment', newCommentRef.value)
  }
}

const editComment = () => {
  if (newCommentRef.value.trim()) {
    emits('edit:comment', newCommentRef.value)
    cancelEditComment()
  }
}

const cancelEditComment = () => {
  emits('cancel:edit')
  resetInput()
}

const resetInput = () => {
  newCommentRef.value = ''
  if (commentTextareaRef.value) {
    commentTextareaRef.value.innerHTML = ''
    commentTextareaRef.value?.focus()
  }
}

const handleBlur = () => {}

const resizeTextarea = (): void => {
  if (commentTextareaRef.value) {
    commentTextareaRef.value.style.height = 'auto'
    if (newCommentRef.value !== '') {
      commentTextareaRef.value.style.height = `${commentTextareaRef.value.scrollHeight}px`
    }
  }
}

const setCursorToEnd = () => {
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(commentTextareaRef.value as Node)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

watch(
  () => props.isEditing && props.comment,
  () => {
    if (props.isEditing && props.comment && commentTextareaRef.value) {
      commentTextareaRef.value.innerHTML = props.comment.content
      newCommentRef.value = props.comment.content
      commentTextareaRef.value?.focus()
      setCursorToEnd()
    } else {
      resetInput()
    }
  }
)
</script>

<template>
  <div class="flex flex-col rounded-md input-container">
    <span v-if="isCommentEmpty" class="placeholder-text">Ajouter un commentaire...</span>
    <i v-if="isEditing" class="pi pi-times cursor-pointer cancel-edit" @click="cancelEditComment" />
    <div
      contenteditable="true"
      spellcheck="false"
      @keydown="handleKeydown"
      @input="handleInput"
      @blur="handleBlur"
      class="p-2 input-text-area"
      ref="commentTextareaRef"
    ></div>
  </div>
</template>

<style scoped>
.input-container {
  position: relative;
  min-height: 2rem;
}

.input-text-area {
  min-height: 2rem;
  border: 1px solid rgba(170, 170, 170, 0.8);
  border-radius: 6px;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  position: relative;
}

.placeholder-text {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: rgba(153, 153, 153, 0.8);
  pointer-events: none;
  padding-left: 0.5rem;
  z-index: 0;
}

.cancel-edit {
  position: absolute;
  top: 50%;
  right: 0;
  margin-right: 10px;
  transform: translateY(-50%);
  z-index: 1;
}
</style>
