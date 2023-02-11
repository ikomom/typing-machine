<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { Pane, Splitpanes } from 'splitpanes'

const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('sm')
</script>

<template>
  <Splitpanes h-screen w-screen :horizontal="isMobile">
    <Pane :min-size="20">
      <Editor />
    </Pane>
    <Pane :min-size="20">
      <Preview />
    </Pane>
  </Splitpanes>
</template>

