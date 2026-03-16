<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import { Wallet } from 'lucide-vue-next'

const wallet = useWalletStore()
</script>

<template>
  <div class="wallet-chip">
    <Wallet :size="16" />
    <span class="money">${{ wallet.balance.toFixed(2) }}</span>
  </div>
</template>

<style scoped>
.wallet-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
}
</style>
