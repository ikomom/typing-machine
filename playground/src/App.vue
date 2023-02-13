<script setup lang="ts">
import { sliceInput } from '../../packages/core/src'
sliceInput(`
import { describe, expect, it } from 'vitest'
import { one } from '../src'

describe('should', () => {
  it('exported', () => {
    expect(one).toEqual(1)
  })
})
`)
</script>

<template>
  <div font-sans leading-1em>
    <Playground />
  </div>
</template>
