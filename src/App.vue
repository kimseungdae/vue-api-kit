<template>
  <div class="min-h-screen bg-gray-100">
    <Demo />
  </div>
</template>

<script setup lang="ts">
import Demo from './components/Demo.vue'

// MSW 설정 불러오기
import './mocks/worker'
</script> 