import highlight from 'cli-highlight'
import type { Snapshots } from 'ik-typing-machine'
import cliCursor from 'cli-cursor'
import { createLogUpdate } from 'log-update'

const langMap: Record<string, string> = {
  ts: 'typescript',
}

export async function playInTerminal(snaps: Snapshots, lang?: string) {
  console.clear()
  const log = createLogUpdate(
    process.stdout,
    { showCursor: true },
  )

  for await (const snap of snaps.typeMachine()) {
    switch (snap.type) {
      case 'init':
      case 'insert':
      case 'removal':
      case 'animator-finish':
        cliCursor.hide()
        process.stdout.cursorTo(0, snap.content.split('\n').length - 1)
        log(highlight(snap.content, {
          language: lang ? langMap[lang] : lang,
          ignoreIllegals: true,
        }))

        if (snap.type !== 'init' && snap.type !== 'animator-finish') {
          const pre = snap.content.slice(0, snap.cursor)
          const lines = pre.split('\n')
          const char = lines[lines.length - 1].length
          process.stdout.cursorTo(char, lines.length - 1)
          cliCursor.show()
        }
    }
  }
  log.done()
}
