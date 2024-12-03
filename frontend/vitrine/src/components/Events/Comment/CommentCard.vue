<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Comment } from '@/types/commentInterfaces'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  comment: {
    type: Object as () => Comment,
    required: true
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emits = defineEmits(['start:edit-comment', 'cancel:edit-comment', 'delete:comment'])
const userStore = useUserStore()

const openEditComment = (comment: Comment): void => {
  unSetConfirmDelete()
  emits('start:edit-comment', comment)
}

const cancelEditComment = (): void => {
  emits('cancel:edit-comment')
}

const showConfirmDeleteRef = ref(false)

const setConfirmDelete = (): void => {
  emits('cancel:edit-comment')
  showConfirmDeleteRef.value = true
}

const unSetConfirmDelete = (): void => {
  showConfirmDeleteRef.value = false
}

const deleteComment = (commentId: number): void => {
  emits('delete:comment', commentId)
}

const formatDate = computed(() => {
  const date = props.comment?.publicationDate ? new Date(props.comment.publicationDate) : new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  const formattedDate = date.toLocaleDateString('fr-FR', options)
  const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const result = `${formattedDate}, ${formattedTime}`
  return result.charAt(0).toUpperCase() + result.slice(1)
})

const maxCharsToDisplay = 150

const truncatedContent = computed(() => {
  if (!isOverflowing.value || isExpanded.value || !props.comment.content) {
    return props.comment.content
  }

  return props.comment.content.slice(0, maxCharsToDisplay) + '...'
})

const isExpanded = ref(false)

const toggleExpand = (): void => {
  isExpanded.value = !isExpanded.value
}

const contentRef = ref<HTMLElement>()
const isOverflowing = ref(false)

const checkOverflow = () => {
  if (contentRef.value) {
    contentRef.value.style.display = 'none'
    contentRef.value.offsetHeight
    contentRef.value.style.display = ''

    isOverflowing.value = contentRef.value.scrollHeight > contentRef.value.clientHeight
  }
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOverflow)
})
</script>

<template>
  <div :class="['comment-card', isEditing ? 'editing' : '']">
    <div class="flex justify-between">
      <div class="flex gap-4 items-center">
        <div class="flex flex-col">
          <span class="login">{{ comment.login }}</span>
          <span class="date">{{ formatDate }}</span>
        </div>
      </div>
      <div
        v-if="userStore.user?.login === comment.login"
        class="flex gap-3 items-center cursor-pointer"
      >
        <i v-if="!isEditing" class="pi pi-pencil" @click="openEditComment(comment)" />
        <i v-else class="pi pi-times" @click="cancelEditComment" />
        <i v-if="!showConfirmDeleteRef" class="pi pi-trash" @click="setConfirmDelete()" />
        <i v-else class="pi pi-times" @click="unSetConfirmDelete" />
      </div>
    </div>
    <p ref="contentRef" :class="['comment mt-2', isExpanded ? 'expanded' : 'collapsed']">
      {{ truncatedContent }}
    </p>
    <div v-if="isOverflowing && !isExpanded">
      <button @click="toggleExpand" class="mt-2 see-more">Lire la suite</button>
    </div>
    <div v-else-if="isExpanded">
      <button @click="toggleExpand" class="mt-2 see-more">Moins</button>
    </div>
    <button v-if="showConfirmDeleteRef" @click="deleteComment(comment.id)" class="btn-route mt-4">
      Supprimer mon commentaire
    </button>
  </div>
</template>

<style scoped>
.comment-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
  position: relative;

  .login {
    font-size: 0.9rem;
    font-weight: 800;
    font-family: 'Unbounded', sans-serif;
  }

  .date {
    font-size: 0.8rem;
    color: #666;
  }

  .comment {
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: max-height 0.3s ease;
  }

  .collapsed {
    max-height: 4.5em;
    overflow: hidden;
  }

  .expanded {
    max-height: none;
  }

  .see-more {
    color: rgb(153, 153, 153);
    background: none;
    border: none;
    cursor: pointer;
  }
}

.comment-card.editing {
  background-color: rgba(40, 112, 148, 0.3);
}
</style>
