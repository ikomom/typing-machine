<script lang="ts" setup>
import type { Snapshots } from 'ik-typing-machine'
import Snap from './Snap.vue'

const { snaps } = defineProps<{ snaps: Snapshots }>()
const container = $ref<HTMLDivElement>(undefined!)
</script>

<template>
  <div ref="container" flex="~ col" p4>
    <Snap v-for="(snap, idx) of snaps" :key="idx" :index="idx" :snap="snap" :snaps="snaps" />
  </div>
</template>
