<script setup lang="ts">
import Snapshots from './components/Snapshots.vue'
import { snaps } from './logics/snaps'
</script>

<template>
  <div font-sans leading-1em>
    <Snapshots
      :snaps="snaps"
    />
  </div>
</template>
