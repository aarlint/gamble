<script setup lang="ts">
import { useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { computed } from 'vue'

const route = useRoute()
const showNav = computed(() => !['/', '/game'].some((p) =>
  p === '/' ? route.path === '/' : route.path.startsWith(p)
))
</script>

<template>
  <div class="app-content">
    <router-view />
  </div>
  <BottomNav v-if="showNav" />
</template>
