<script setup lang="ts">
import Like from '@/components/Events/Like/Like.vue'
import { ref, defineProps, onMounted } from 'vue'
import type { Event } from '@/types/eventInterfaces'
import CommentService from '@/services/event/comment'
import { useToast } from 'primevue/usetoast'
import Comment from '@/components/Events/Comment/Comment.vue'

const props = defineProps({
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

const toast = useToast()
const commentService = new CommentService(toast, props.event.id)
const totalCommentsRef = ref<number>(0)
const showCommentsRef = ref(false)

const toggleComments = (): void => {
  showCommentsRef.value = !showCommentsRef.value
}

onMounted(async () => {
  const { count } = await commentService.getComments(20, 0)
  totalCommentsRef.value = count
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4 select-none">
      <Like
        :event-id="props.event.id"
        :liked-by-user="props.event.isLikedByUser"
        :likes-count="props.event.likeCount"
      />

      <div
        v-if="totalCommentsRef > 0"
        class="flex items-center cursor-pointer"
        @click="toggleComments"
      >
        <span class="underline text-comment-toggle"
          >{{ showCommentsRef ? 'Masquer les commentaires' : 'Afficher les commentaires' }} ({{
            totalCommentsRef
          }})</span
        >
        <i class="pi pi-chevron-down arrow-icon" :class="showCommentsRef ? 'rotate-180' : ''" />
      </div>
      <div v-else class="text-comment-toggle">Aucun commentaire</div>
    </div>

    <Comment
      :event="props.event"
      :show-comments="showCommentsRef"
      @update:show-comments="showCommentsRef = $event"
      @update:total-comments="totalCommentsRef = $event"
    />
  </div>
</template>

<style scoped>
.text-comment-toggle {
  font-size: 1rem;
  font-weight: 500;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

.rotate-180 {
  transform: rotate(180deg);
}

.text-comment-title {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
