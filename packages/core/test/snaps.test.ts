import { promises as fs } from 'fs'
import * as os from 'os'
import path from 'path'
import { describe, expect, it } from 'vitest'
import type { Snapshot } from '../src'
import { Snapshots, replaceAll } from '../src'

const removeEol = (str: string) => replaceAll(replaceAll(str, '\r', ''), '\n', '')

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

  it('EOL test', async () => {
    const str = await fs.readFile(path.resolve('example/main.js.typingmachine'), 'utf-8')
    const deserialized = Snapshots.fromString(str, os.EOL)
    expect(deserialized).toMatchSnapshot()
    const snaps = new Snapshots(...deserialized)
    expect(removeEol(snaps.toString(os.EOL))).toEqual(removeEol(str))
  })
})
