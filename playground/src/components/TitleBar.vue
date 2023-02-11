<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div
    border="r y gray-400/20"
    text="gray-400"
    p-2
    select-none
    flex
    items="center"
  >
    <slot name="before" />
    <div mr-2 op-60>
      {{ title }}
    </div>
    <div flex gap-2 flex-auto>
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.splitpanes.loading .splitpanes__pane {
  transition: none !important;
}
.icon-btn {
  @apply text-xl op75 hover:op100;
}
</style>
