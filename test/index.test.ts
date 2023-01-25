import { describe, expect, it } from 'vitest'
import { applyPatches, calculatePatches, diffString } from '../packages/core/src'
import { input, output } from './fixture'

describe('index', () => {
  it('diff', () => {
    const delta = diffString(input, output)
    expect(delta).toMatchSnapshot('delta')
    const patches = calculatePatches(delta)
    expect(patches).toMatchSnapshot('patches')
    const applied = applyPatches(input, patches)
    expect(applied).toMatchSnapshot('output')
    expect(applied).toEqual(output)
  })
})
