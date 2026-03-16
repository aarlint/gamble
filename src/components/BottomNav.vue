<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Dices, LayoutGrid, BarChart3, Wallet } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { path: '/floor', icon: LayoutGrid, label: 'Floor' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
]
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      :class="['nav-item', { active: route.path === tab.path }]"
    >
      <component :is="tab.icon" :size="22" />
      <span>{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 6px 16px;
}

.nav-item.active {
  color: var(--accent-gold);
}
</style>
