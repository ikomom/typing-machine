import * as os from 'os'
import { existsSync, promises as fs } from 'fs'
import { replaceEOL } from 'ik-typing-machine'
import type { Snapshots } from 'ik-typing-machine'
import NReadLines from 'n-readlines'
import { logOut } from './log'

export const snapExt = '.typingmachine'

export function getSnapPath(id: string) {
  return id + snapExt
}

export async function writeSnapshots(filepath: string, snap: Snapshots) {
  const write = snap.toString()
  // logOut('writeSnapshots', { write })
  await fs.writeFile(filepath, write, 'utf-8')
}

/**
 * read Snapshot line by Line
 * @param filepath
 */
export function readSnapshotLine(filepath: string) {
  const result: string[] = []

  if (existsSync(filepath)) {
    const fileLines = new NReadLines(filepath)
    let line
    while (line = fileLines.next()) {
      // console.log(` ${lineNumber} : ${line.toString('ascii')}`)
      result.push(`${replaceEOL(line.toString('ascii'))}`)
    }

    return result
  }
  throw new Error('Snapshots file not Exist')
}
