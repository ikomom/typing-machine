export const input = `
import { describe, expect, it } from 'vitest'
import {ll} from './one'


describe('should', () => {
  it('exported', () => {
    expect(33)
    console.log('hello')
  })
})
`

export const output = `
import { describe, expect, it } from 'vitest'

describe('should', () => {
  it('exported', () => {
    expect(33).toEqual(1)
  })
})
`
