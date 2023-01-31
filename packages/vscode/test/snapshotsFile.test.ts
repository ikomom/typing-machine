// import path from 'path'
// import { promises as fs } from 'fs'
// import { Snapshots } from 'ik-typing-machine'
import { describe, it } from 'vitest'
// import { logOut } from '../src/log'
// import { readSnapshotLine, writeSnapshots } from '../src/snapshotsFile'

describe('snapshotsFile', () => {
  it('read', async () => {
    // const inputPath = path.resolve('example/main.js.typingmachine')
    // const result = readSnapshotLine(inputPath)
    //
    // // await writeSnapshots('example/snapshotsFile.js.typingmachine', Snapshots.fromString(result.join('')))
    // const rawStr = await fs.readFile(inputPath, 'utf-8')
    // const rawArr = rawStr.split(/\r?\n/)
    // expect(rawArr.length).toMatchInlineSnapshot('17')
    // expect(result.length).toMatchInlineSnapshot('16')
    // // splitting  file equal to read line remove EOL string
    // expect(rawArr.join('')).toEqual(result.join(''))

    // const line = Snapshots.fromRawStr(rawStr).toString()
    // logOut({ line })
  })
})

