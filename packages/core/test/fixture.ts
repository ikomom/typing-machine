import type { Snapshot } from '../src'

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
export const snapsData: Snapshot[] = [
  { content: '', options: { wait: 200, pause: false } },
  { content: 'import {} from "vue"' },
  { content: 'import { createApp } from "vue"\n\nconst app = createApp()\n', options: { wait: 100 } },
  { content: 'import { useMemo } from "react"\n\nconst memo = useMemo()\n', options: { wait: 100 } },
]
