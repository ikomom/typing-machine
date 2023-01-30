import { promises as fs } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import type { Snapshot } from '../src'
import { Snapshots } from '../src'

describe('snaps', () => {
  it('persist', () => {
    const data: Snapshot[] = [
      { content: '', options: { wait: 200, pause: false } },
      { content: 'import {} from "vue"' },
      { content: 'import { createApp } from "vue"\n\nconst app = createApp()\n', options: { wait: 100 } },
    ]

    const snaps = new Snapshots(...data)
    const serialized = snaps.toString()

    expect(serialized).toMatchSnapshot('serialized')

    const deserialized = Snapshots.fromString(serialized)

    expect(data).toEqual([...deserialized])
  })

  it('deserialized', async () => {
    const inputPath = path.resolve('example/main.js.typingmachine')
    const serialized = await fs.readFile(inputPath, 'utf-8')
    const deserialized = Snapshots.fromRawStr(serialized)
    // expect(deserialized.toString()).toEqual(serialized)
  })
})
