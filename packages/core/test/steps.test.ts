import { describe, expect, it } from 'vitest'
import { stepsTo } from '../src'
import { input, output } from './fixture'

describe('animator', () => {
  it('generate', () => {
    const animator = stepsTo(input, output)
    expect([...animator]).toMatchSnapshot('animator')
  })
})
