import { existsSync, promises as fs } from 'fs'
import { EndOfLine, Range, Selection, commands, window, workspace } from 'vscode'

import { Snapshots, SnapshotsManager } from 'ik-typing-machine'
import { logOut } from './log'

const snapExt = '.typingmachine'
// const snapExt = '.ts'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function getSnapPath(id: string) {
  return id + snapExt
}

async function writeSnapshots(path: string, snap: Snapshots) {
  const filepath = getSnapPath(path)
  const writed = snap.toString()
  logOut({ writed })
  await fs.writeFile(filepath, writed, 'utf-8')
}

export function activate() {
  logOut('active plugin')

  const manager = new SnapshotsManager({
    // if old snapshot file exist, read it
    async ensureFallback(path: string) {
      const filepath = getSnapPath(path)
      logOut('ensureFallback', { filepath, path })
      if (existsSync(filepath)) {
        const content = await fs.readFile(filepath, 'utf-8')
        const snaps = Snapshots.fromString(content)
        logOut({ snaps, filepath, content })

        window.showInformationMessage('Snapshots loaded from file')
        return snaps
      }
    },
  })

  const wacther = workspace.createFileSystemWatcher(`**/*${snapExt}`)
  // const wacther = workspace.createFileSystemWatcher('**/*.ts')
  // delete old snaps when recreate or rename file
  wacther.onDidCreate((uri) => {
    logOut('File:onDidCreate', {
      uri,
      manager: [...manager],
    })
    manager.delete(uri.fsPath.replace(snapExt, ''))
  })
  wacther.onDidChange((uri) => {
    logOut('File:onDidChange', {
      uri,
      manager: [...manager],
    })
    manager.delete(uri.fsPath.replace(snapExt, ''))
  })

  wacther.onDidDelete((uri) => {
    logOut('File:onDidChange', {
      uri,
      manager: [...manager],
    })
    manager.delete(uri.fsPath.replace(snapExt, ''))
  })

  commands.registerCommand('ik-typing-machine.snap', async () => {
    const doc = window.activeTextEditor?.document
    if (!doc) {
      window.showWarningMessage('document not open')
      return
    }
    const path = doc.uri.fsPath
    const snaps: Snapshots = await manager.ensure(path)
    snaps.push({
      content: doc.getText(),
    })
    logOut('snap', { path, snaps })

    await writeSnapshots(path, snaps)

    window.showInformationMessage(`succeed take ${snaps.length} snapShot of ${doc.fileName}`)
  })

  commands.registerCommand('ik-typing-machine.test', async () => {
    const editor = window.activeTextEditor
    const doc = editor?.document
    if (!doc || !editor) {
      window.showWarningMessage('document not open')
      return
    }

    const arr = ['x', '\n', 'y', '\n', '\n', 'z']

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i]

      await editor.edit((editBuilder) => {
        logOut({ i, value, c: doc.getText(doc.getWordRangeAtPosition(doc.positionAt(i + 1))) })
        editBuilder.insert(doc.positionAt(i + 1), value)
      })
      await sleep(200)
    }
  })

  commands.registerCommand('ik-typing-machine.play', async () => {
    const editor = window.activeTextEditor
    const doc = editor?.document
    if (!doc || !editor) {
      window.showWarningMessage('document not open')
      return
    }
    const snaps: Snapshots = await manager.ensure(doc.uri.fsPath)
    if (!snaps.length) {
      window.showWarningMessage('No snaps found')
      return
    }
    const setEOL = async (eol: EndOfLine) => {
      await editor.edit((editBuilder) => {
        editBuilder.setEndOfLine(eol)
      })
    }
    const setCursor = (index: number) => {
      const pos = doc.positionAt(index)
      editor.selection = new Selection(pos, pos)
    }
    // set Eol to LF, avoid insert text animator error
    const lastEOL = doc.eol
    await setEOL(EndOfLine.LF)
    // compare lastSnap with current doc
    const lastSnap = snaps[snaps.length - 1]
    if (lastSnap.content !== doc.getText()) {
      const take = 'Take Snapshot'
      const discard = 'Discard'
      const cancel = 'Cancel'

      const result = await window.showInformationMessage(
        'The current document has been modified since last snapshot. Do you want take another snapshot?',
        { modal: true },
        take,
        discard,
        cancel,
      )
      if (!result || result === cancel)
        return

      if (result === take)
        await commands.executeCommand('ik-typing-machine.snap')
    }
    window.showInformationMessage(`Playing ${doc.fileName}`)

    logOut({ snaps })
    for (const snap of snaps.animate()) {
      switch (snap.type) {
        case 'init':
          logOut('init', snap)
          await editor.edit((edit) => {
            edit.replace(new Range(0, 0, Infinity, Infinity), snap.content)
          })
          break
        case 'animator-finish':
          logOut('animator-finish', { text: doc.getText() })
          break
        case 'new-snap':
          await sleep(900)
          break

        case 'insert':
          await editor.edit((edit) => {
            // const eol = snap.char === '\n' ? '\r\n' : snap.char
            // logOut('insert', { i: snap.cursor - 1, char: snap.char, eol })

            edit.insert(doc.positionAt(snap.cursor - 1), snap.char)
          })
          setCursor(snap.cursor)
          await sleep(Math.random() * 100)
          break
        case 'removal':
          await editor.edit((edit) => {
            edit.delete(new Range(doc.positionAt(snap.cursor), doc.positionAt(snap.cursor + 1)))
          })
          setCursor(snap.cursor)
          await sleep(Math.random() * 10)
          break
      }
    }
    await setEOL(lastEOL)

    window.showInformationMessage(`Finished ${doc.fileName}`)
  })
}

export function deactivate() {
  logOut('deactivate plugin')
}
