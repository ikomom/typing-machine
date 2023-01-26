import { describe, expect, it } from 'vitest'
import type { Snapshot } from '../src'
import { Snapshots } from '../src'

describe('snaps', () => {
  it('persist', () => {
    const data: Snapshot[] = [
      { content: '', options: { wait: 200 } },
      { content: 'import {} from "vue"', options: { wait: 100 } },
      { content: 'import { createApp } from "vue"\n\nconst app = createApp()\n', options: { wait: 100 } },
    ]

    const snaps = new Snapshots(...data)
    const serialized = snaps.toString()

    expect(serialized).toMatchSnapshot('serialized')

    const deserialized = Snapshots.fromString(serialized)

    expect(data).toEqual([...deserialized])
  })
})
