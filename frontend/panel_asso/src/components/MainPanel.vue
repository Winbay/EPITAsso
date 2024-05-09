<script setup lang="ts">

</script>

<template>
  <div class="page-content flex-grow">
    <router-view></router-view>
  </div>
</template>

<style>
#main-content > .page-content {
  margin-left: 14rem;
  transition: margin-left 0.2s;
}

#main-content.panel-inactive .page-content {
  margin-left: 0;
}
</style>