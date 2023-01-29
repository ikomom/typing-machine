import * as os from 'os'
import { existsSync, promises as fs } from 'fs'
import { Snapshots } from 'ik-typing-machine'
import NReadLines from 'n-readlines'
import { logOut } from './log'

export const snapExt = '.typingmachine'

export function getSnapPath(id: string) {
  return id + snapExt
}

export async function writeSnapshots(filepath: string, snap: Snapshots) {
  const write = snap.toString(os.EOL)
  logOut('writeSnapshots', { write })
  await fs.writeFile(filepath, write, 'utf-8')
}

/**
 * read Snapshot line by Line
 * @param filepath
 */
export function readSnapshotLine(filepath: string) {
  if (existsSync(filepath)) {
    const fileLines = new NReadLines(filepath)
    let line
    const result = []
    while (line = fileLines.next()) {
      // console.log(` ${lineNumber} : ${line.toString('ascii')}`)
      result.push(`${line.toString('ascii').trim()}`)
    }

    return Snapshots.fromString(result.join('\n'))
  }
  else {
    return new Snapshots()
  }
}
