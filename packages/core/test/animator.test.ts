import { describe, expect, it } from 'vitest'
import { animateTo } from '../src'
import { input, output } from './fixture'

describe('animator', () => {
  it('generate', () => {
    const animator = animateTo(input, output)
    expect([...animator]).toMatchSnapshot('animator')
  })
})
