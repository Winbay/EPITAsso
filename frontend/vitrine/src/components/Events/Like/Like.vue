<script setup lang="ts">
import LikeService from '@/services/event/like'
import { useToast } from 'primevue/usetoast'
import { defineProps, ref } from 'vue'

const props = defineProps({
  eventId: {
    type: Number,
    required: true
  },
  likedByUser: {
    type: Boolean,
    required: true
  },
  likesCount: {
    type: Number,
    required: true
  }
})

const toast = useToast()
const likeService = new LikeService(toast, props.eventId as number)
const isLikedRef = ref(props.likedByUser)
const likesCountRef = ref(props.likesCount)

const toggleLike = async (): Promise<void> => {
  try {
    if (!isLikedRef.value) {
      await likeService.like()
    } else {
      await likeService.unlike()
    }
  } catch (error) {
    console.error('Failed to handle like:', error)
  } finally {
    isLikedRef.value = !isLikedRef.value
    likesCountRef.value += isLikedRef.value ? 1 : -1
  }
}
</script>

<template>
  <div class="flex items-center">
    <i
      @click="toggleLike"
      :class="['pi', 'cursor-pointer', 'like-icon', isLikedRef ? 'pi-thumbs-up-fill' : 'pi-thumbs-up']"
    />
    <span class="ml-2">{{ likesCountRef }}</span>
  </div>
</template>

<style scoped>
.like-icon {
  width: 1rem;
  height: 1rem;
}

.like-icon:active {
  transform: scale(1.1);
}
</style>