import { describe, expect, it } from 'vitest'
import { applyPatches, calculatePatches, diffString } from '../src'

const input = `
import { describe, expect, it } from 'vitest'
import {ll} from './one'

describe('should', () => {
  it('exported', () => {
    expect(33)
    console.log('hello')
  })
})
`

const output = `
import { describe, expect, it } from 'vitest'

describe('should', () => {
  it('exported', () => {
    expect(33).toEqual(1)
  })
})
`
describe('should', () => {
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
