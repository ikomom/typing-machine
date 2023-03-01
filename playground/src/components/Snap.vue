<script lang="ts" setup>
import type { Snapshot, Snapshots } from 'ik-typing-machine'

const props = defineProps<{ snaps: Snapshots;snap: Snapshot; index: number }>()
const el = $ref<HTMLDivElement>(undefined!)
let dragHover = $ref<'up' | 'down' | null>()

function getHoverDirection(e: DragEvent) {
  const box = el.getBoundingClientRect()
  const y = e.clientY - box.top
  const h = box.height
  const mid = h / 2
  // console.log({ y, h, mid })
  return y < mid ? 'up' : 'down'
}

function allowDrop(e: DragEvent) {
  e.preventDefault()
  dragHover = getHoverDirection(e)
}

function onDrop(e: DragEvent) {
  const from = +(e.dataTransfer!.getData('text/plain') || -1)
  const direction = getHoverDirection(e)
  const to = props.index + (direction === 'up' ? 0 : 1)
  props.snaps.move(from, to)

  dragHover = null
}
function onDrag(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(props.index))
  }
}
function onDragExit() {
  dragHover = null
}

const classes = $computed(() => {
  if (!dragHover)
    return
  return [
    dragHover === 'up' ? 'border-t-red' : 'border-b-red',
  ]
})
</script>

<template>
  <div
    ref="el"
    bg-base p2 mb--2px
    draggable="true"
    border="2 transparent"
    grid="~ cols-[40px_1fr]"
    :class="classes"
    @dragstart="onDrag"
    @drag="onDrag"
    @dragover="allowDrop"
    @dragexit="onDragExit"
    @dragleave="onDragExit"
    @drop="onDrop"
  >
    <div op50 py1>
      [{{ index + 1 }}]
    </div>
    <pre
      w-full border="1 gray"
      p2 font-mono
      overflow-x-auto
      :contenteditable="true"
      autocomplete="false"
      spellcheck="false"
      v-text="snap.content"
    />
  </div>
</template>
