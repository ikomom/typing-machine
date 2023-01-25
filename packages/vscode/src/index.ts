import { Range, Selection, commands, window } from 'vscode'
import { simpleAnimator } from 'ik-typing-machine'

interface SnapShot {
  content: string
  time: number
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function activate() {
  const snapMap = new Map<string, SnapShot[]>()

  commands.registerCommand('ik-typing-machine.snap', () => {
    const doc = window.activeTextEditor?.document
    if (!doc) {
      window.showWarningMessage('document not open')
      return
    }
    const path = doc.uri.fsPath
    if (!snapMap.has(path))
      snapMap.set(path, [])
    const snaps = snapMap.get(path)
    snaps!.push({
      content: doc.getText(),
      time: Date.now(),
    })
    window.showInformationMessage(`succeed take ${snaps!.length} snapShot of ${doc.fileName}`)
  })

  commands.registerCommand('ik-typing-machine.play', async () => {
    const editor = window.activeTextEditor
    const doc = editor?.document
    if (!doc || !editor) {
      window.showWarningMessage('document not open')
      return
    }
    const snaps = snapMap.get(doc.uri.fsPath)
    if (!snaps?.length) {
      window.showWarningMessage('No snaps found')
      return
    }
    // compare lastSnap with current doc
    const lastSnap = snaps[snaps.length - 1]
    if (lastSnap.content !== doc.getText()) {
      snaps.push({
        content: doc.getText(),
        time: Date.now(),
      })
      window.showInformationMessage('Add new last snap')
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

  commands.registerCommand('ik-typing-machine.clear', () => {
    const editor = window.activeTextEditor
    const doc = editor?.document
    if (!doc || !editor) {
      window.showWarningMessage('document not open')
      return
    }
    snapMap.delete(doc.uri.fsPath)
    window.showInformationMessage(`success clear ${doc.fileName}`)
  })
}

export function deactivate() {
}
