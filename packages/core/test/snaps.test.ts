import { promises as fs } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { Snapshots, replaceEOL } from '../src'
import { snapsData } from './fixture'

// async function writeSnapshots(fileName: string, snap: Snapshots) {
//   const write = snap.toString()
//   // logOut('writeSnapshots', { write })
//   await fs.writeFile(path.resolve(`example/__test__/${fileName}`), write, 'utf-8')
// }
async function readSnapshots(fileName: string) {
  const inputPath = path.resolve(`example/__test__/${fileName}`)
  return fs.readFile(inputPath, 'utf-8')
}

describe('snaps', () => {
  it('persist', async () => {
    const snaps = new Snapshots(...snapsData)
    const serialized = snaps.toString()

    expect(serialized).toMatchSnapshot('serialized')

    const deserialized = Snapshots.fromString(serialized)

    expect(snapsData).toEqual([...deserialized])
    // await writeSnapshots('snaps_persist.js.typingmachine', snaps)
  })

  it('deserialized', async () => {
    const serialized = await readSnapshots('snaps_deserialized.js.typingmachine')
    const deserialized = Snapshots.fromString(serialized).toString()

    expect(deserialized).toMatchSnapshot('output')
    expect(serialized).toMatchSnapshot('input')
    expect(replaceEOL(deserialized)).toEqual(replaceEOL(serialized))
  })
})
