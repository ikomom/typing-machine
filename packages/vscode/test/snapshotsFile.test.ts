import { createReadStream, promises as fs } from 'fs'
import * as os from 'os'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { logOut } from '../src/log'
import { readSnapshotLine, writeSnapshots } from '../src/snapshotsFile'

describe('snapshotsFile', () => {
  it('read', async () => {
    const result = readSnapshotLine(path.resolve('example/main.js.typingmachine'))
    console.log({ result })
    await writeSnapshots('example/snapshotsFile.js.typingmachine', result)
  })
})

