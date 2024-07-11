<script setup lang="ts"></script>

<template>
  <div class="page-content flex-grow overflow-auto">
    <router-view class="h-full"></router-view>
  </div>
</template>

<style>
#main-content > .page-content {
  background-color: #131923;
  height: 100%;
  margin-left: 14rem;
  transition: margin-left 0.2s;
}

#main-content.panel-inactive .page-content {
  margin-left: 0;
}
</style>
