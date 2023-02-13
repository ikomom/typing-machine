<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { isDark, version } from '../logics/utils'
import CodeMirror from './CodeMirror.vue'
import TitleBar from './TitleBar.vue'

const loading = ref(false)
const panel = ref()

const TITLE_HEIGHT = 34
const { height: vh } = useWindowSize()
const titleHeightPercent = computed(() => TITLE_HEIGHT / vh.value * 100)

const handleResize = (event: { size: number }[]) => {
  // eslint-disable-next-line no-console
  console.log('event', event)
}
const value = ref(`function index(){
  const a = 'hello'
  console.log(a, 'world')
}
`)
</script>

<template>
  <Splitpanes ref="panel" :class="{ loading }" horizontal h-screen @resize="handleResize">
    <Pane :min-size="titleHeightPercent" flex="~ col">
      <TitleBar title="HTML">
        <div flex-auto />
        <div text-sm op50>
          v{{ version }}
        </div>
        <button
          i-carbon-sun
          dark-i-carbon-moon
          class="icon-btn"
          @click="isDark = !isDark"
        />
      </TitleBar>
      <CodeMirror v-model="value" mode="js" flex-auto class="scrolls border-(r gray-400/20)" />
    </Pane>
    <Pane :min-size="titleHeightPercent" flex="~ col">
      <TitleBar title="Output CSS" />
    </Pane>
    <Pane :min-size="titleHeightPercent" flex="~ col">
      <TitleBar title="Config" />
    </Pane>
  </Splitpanes>
</template>

<style scoped>

</style>
