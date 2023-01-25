import { describe, expect, it } from 'vitest'
import { calculatePatches, createAnimator, diffString } from '../packages/core/src'
import { input, output } from './fixture'

describe('animator', () => {
  it('generate', () => {
    const delta = diffString(input, output)
    const patches = calculatePatches(delta)
    const animator = createAnimator(input, patches)
    expect([...animator]).toMatchSnapshot('animator')
  })
})
