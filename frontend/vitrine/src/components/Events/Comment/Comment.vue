<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CommentService from '@/services/event/comment'
import { useToast } from 'primevue/usetoast'
import type { Event } from '@/types/eventInterfaces'
import type { Comment } from '@/types/commentInterfaces'
import CommentCard from '@/components/Events/Comment/CommentCard.vue'
import CommentInput from '@/components/Events/Comment/CommentInput.vue'

const props = defineProps({
  showComments: {
    type: Boolean,
    required: true
  },
  event: {
    type: Object as () => Event,
    required: true,
    default: () => ({
      id: 14,
      isLikedByUser: false,
      likeCount: 0
    })
  }
})

const emits = defineEmits(['update:showComments', 'update:totalComments'])

const toast = useToast()
const commentService = new CommentService(toast, props.event.id)
const commentsRef = ref<Comment[]>([])
const totalCommentsRef = ref<number>(0)

const fetchComments = async (limit: number, offset: number): Promise<void> => {
  isFetchingRef.value = true
  try {
    const { count, results } = await commentService.getComments(limit, offset)
    commentsRef.value = [...commentsRef.value, ...results]
    totalCommentsRef.value = count
  } catch (error) {
    console.error('Error fetching comments:', error)
  } finally {
    isFetchingRef.value = false
  }
}

const postComment = async (newComment: string): Promise<void> => {
  try {
    const commentResponse = await commentService.createComment(newComment)
    commentsRef.value = [commentResponse, ...commentsRef.value]
    totalCommentsRef.value += 1
    emits('update:totalComments', totalCommentsRef.value)
    if (!props.showComments) {
      emits('update:showComments', true)
    }
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}

const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await commentService.deleteComment(commentId)
  } catch (error) {
    console.error('Error deleting comment:', error)
  } finally {
    commentsRef.value = commentsRef.value.filter((comment) => comment.id !== commentId)
    totalCommentsRef.value -= 1
    emits('update:totalComments', totalCommentsRef.value)
    if (totalCommentsRef.value === 0) {
      emits('update:showComments', false)
    }
  }
}

const isEditing = ref(false)
const editingComment = ref<Comment>({ id: -1, login: '', content: '', publicationDate: '' })
const startEditComment = (comment: Comment): void => {
  isEditing.value = true
  editingComment.value = { ...comment }
}

const cancelEditComment = (): void => {
  isEditing.value = false
  editingComment.value.id = -1
}

const editComment = async (newComment: string): Promise<void> => {
  try {
    const editedComment = editingComment.value
    editedComment.content = newComment
    const response = await commentService.updateComment(editedComment)
    commentsRef.value = commentsRef.value.map((comment) =>
      comment.id === response.id ? response : comment
    )
  } catch (error) {
    console.error('Error editing comment:', error)
  } finally {
    cancelEditComment()
  }
}

const isFetchingRef = ref(false)
const limit = 2
let offset = 0

watch(commentsRef, async (newComments, oldComments) => {
  if (newComments.length !== oldComments.length) {
    offset = newComments.length
  }
})

const scrollEndTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observer.value = new IntersectionObserver(async (entries) => {
    const entry = entries[0]
    if (
      entry.isIntersecting &&
      commentsRef.value.length < totalCommentsRef.value &&
      !isFetchingRef.value
    ) {
      await fetchComments(limit, offset)
    }
  })
})

onBeforeUnmount(() => {
  if (observer.value && scrollEndTrigger.value) {
    observer.value?.unobserve(scrollEndTrigger.value)
  }
})

const isInitialFetchDoneRef = ref(false)

watch(
  () => props.showComments,
  async (newValue) => {
    if (newValue && !isInitialFetchDoneRef.value) {
      await fetchComments(limit, offset)
      isInitialFetchDoneRef.value = true
    }
    if (newValue && scrollEndTrigger.value) {
      observer.value?.observe(scrollEndTrigger.value)
    } else if (!newValue && scrollEndTrigger.value) {
      observer.value?.unobserve(scrollEndTrigger.value)
    }
  }
)
</script>

<template>
  <div class="flex flex-col">
    <CommentInput
      @cancel:edit="cancelEditComment"
      @edit:comment="editComment"
      @post:comment="postComment"
      :is-editing="isEditing"
      :comment="editingComment"
    />
    <div v-if="showComments" class="comments-container" ref="commentsContainer">
      <CommentCard
        v-for="comment in commentsRef"
        :key="comment.id"
        :comment="comment"
        :is-editing="isEditing && editingComment?.id === comment.id"
        @start:edit-comment="startEditComment"
        @cancel:edit-comment="cancelEditComment"
        @delete:comment="deleteComment"
      />
      <div ref="scrollEndTrigger" class="invisible-trigger"></div>
      <div v-if="isFetchingRef" class="loading-container">
        <div class="loading-card" v-for="i in 3" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  padding-right: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #125386;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #033a6a;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-card {
  background-color: #f0f0f0;
  height: 60px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

.invisible-trigger {
  height: 1px;
  opacity: 0;
}
</style>
