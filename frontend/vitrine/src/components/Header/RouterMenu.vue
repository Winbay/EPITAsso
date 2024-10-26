<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const routes = [
  { path: '/', name: 'Accueil' },
  { path: '/associations', name: 'Associations' },
  { path: '/events', name: 'Évènements' }
]
</script>

<template>
  <div class="flex text-xl w-80 justify-between">
    <div
      v-for="(routeItem, index) of routes"
      :key="index"
      :class="['route relative', { active: routeItem.path === route.path }]"
    >
      <router-link :to="routeItem.path">{{ routeItem.name }}</router-link>
    </div>
  </div>
</template>

<style scoped>
.route {
  color: #4482a1;
}

.route.active {
  font-weight: 500;
}

.route.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4482a1;
}
</style>
