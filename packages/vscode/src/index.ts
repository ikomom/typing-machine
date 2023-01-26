import { existsSync, promises as fs } from 'fs'
import { Range, Selection, commands, window, workspace } from 'vscode'
import { SnapshotManager, Snapshots, simpleAnimator } from 'ik-typing-machine'
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
  await fs.writeFile(filepath, snap.toString(), 'utf-8')
}

export function activate() {
  logOut('active plugin')

  const manager = new SnapshotManager({
    // if old snapshot file exist, read it
    async ensureFallback(path: string) {
      const filepath = getSnapPath(path)
      if (existsSync(filepath)) {
        const content = await fs.readFile(filepath, 'utf-8')
        const snaps = Snapshots.fromString(content)
        window.showInformationMessage('Snapshots loaded from file')
        return snaps
      }
    },
  })

  const wacther = workspace.createFileSystemWatcher(`**/*${snapExt}`)
  // const wacther = workspace.createFileSystemWatcher('**/*.ts')
  // delete old snaps when recreate or rename file
  wacther.onDidCreate((uri) => {
    logOut('File:onDidCreate', uri)
    manager.delete(uri.path.replace(snapExt, ''))
  })
  wacther.onDidChange((uri) => {
    logOut('File:onDidChange', uri)
  })

  commands.registerCommand('ik-typing-machine.snap', async () => {
    const doc = window.activeTextEditor?.document
    if (!doc) {
      window.showWarningMessage('document not open')
      return
    }
    const path = doc.uri.fsPath
    const snaps = await manager.ensure(path)
    snaps.push({
      content: doc.getText(),
    })
    logOut('snap', { path, snaps })

    await writeSnapshots(path, snaps)

    window.showInformationMessage(`succeed take ${snaps.length} snapShot of ${doc.fileName}`)
  })

  commands.registerCommand('ik-typing-machine.play', async () => {
    const editor = window.activeTextEditor
    const doc = editor?.document
    if (!doc || !editor) {
      window.showWarningMessage('document not open')
      return
    }
    const snaps = await manager.ensure(doc.uri.fsPath)
    if (!snaps.length) {
      window.showWarningMessage('No snaps found')
      return
    }
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

    let lastContent: string | undefined
    for (const snap of snaps) {
      // save first exist snap document
      if (lastContent === undefined) {
        lastContent = snap.content
        // clear doc
        await editor.edit((edit) => {
          edit.replace(new Range(0, 0, Infinity, Infinity), lastContent!)
        })
        continue
      }

      // play animate
      const animator = simpleAnimator(lastContent!, snap.content)
      for (const result of animator) {
        const pos = doc.positionAt(result.cursor)
        await editor.edit((edit) => {
          if (result.type === 'insert-ing')
            edit.insert(doc.positionAt(result.cursor - 1), result.char ?? '')
          else if (result.type === 'removal-ing')
            edit.delete(new Range(pos, doc.positionAt(result.cursor + 1)))
        })

        editor.selection = new Selection(pos, pos)

        await sleep(Math.random() * 200)
      }

      lastContent = snap.content
    }

    window.showInformationMessage(`Finished ${doc.fileName}`)
  })
}

export function deactivate() {
  logOut('deactivate plugin')
}
