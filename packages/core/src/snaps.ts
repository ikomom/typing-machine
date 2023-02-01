import { simpleAnimator } from './animator'
import type { AnimatorStep, Snapshot } from './types'

export const SNAP_HEADING = 'ik-typing-machine Snapshots v1'
export const SNAP_SEPARATOR_PRE = '-'.repeat(2)
export const SNAP_SEPARATOR_SUFFIX = '-'.repeat(10)
export const SNAP_SEPARATOR_OPTIONS = '----OPTIONS----'
export const SNAP_SEPARATOR = `${SNAP_SEPARATOR_PRE}--${SNAP_SEPARATOR_SUFFIX}`
export const SNAP_SEPARATOR_MATCHER = new RegExp(`\\r?\\n${SNAP_SEPARATOR_PRE}[#\\w-]*${SNAP_SEPARATOR_SUFFIX}\\r?\\n?`, 'g')
export const SNAP_SEPARATOR_MATCHER_OPTIONS = new RegExp(`\\r?\\n${SNAP_SEPARATOR_OPTIONS}`, 'g')
export const SNAP_BEGIN_REGEXP = new RegExp(`${SNAP_SEPARATOR_PRE}[\\w]*${SNAP_SEPARATOR_SUFFIX}`)

/**
 * Snapshot store
 */
export class Snapshots extends Array<Snapshot> {
  constructor(...props: Snapshot[]) {
    super(...props)
  }

  get last() {
    return this[this.length - 1]
  }

  get first() {
    return this[0]
  }

  toString(): string {
    return [
      `${SNAP_HEADING}\n`,
      ...this.flatMap((snap, i) => {
        return [
          `${SNAP_SEPARATOR_PRE + String(i + 1).padStart(2, '0') + SNAP_SEPARATOR_SUFFIX}`,
          snap.content,
          ...(snap.options
            ? [
                SNAP_SEPARATOR_OPTIONS,
                JSON.stringify(snap.options, null, 0),
              ]
            : []),
        ]
      }),
      SNAP_SEPARATOR,
      '',
    ].join('\n')
  }

  static fromString(raw: string) {
    const lines = raw.split(/\r?\n/)
    const snapshots: Snapshot[] = []

    let line = ''
    let start = false
    let index = 0
    let options
    let skipNext = false

    for (let i = 0; i < lines.length; i++) {
      const item = lines[i]
      const next = lines[i + 1]
      const IS_BEGIN = (str: string) => SNAP_BEGIN_REGEXP.test(str)
      const IS_OPTION = (str: string) => SNAP_SEPARATOR_OPTIONS === str

      if (skipNext) {
        skipNext = false
        continue
      }

      if (IS_BEGIN(item)) {
        start = true
        if (index !== 0) {
          // console.log('match', { item, line, l: snapshots.length })
          const snapshot: Snapshot = {
            content: line,
          }
          if (options)
            snapshot.options = options

          snapshots.push(snapshot)
          line = ''
          options = undefined
        }
        index++
      }
      else if (IS_OPTION(item)) {
        try {
          options = JSON.parse(lines[i + 1])
          skipNext = true
        }
        catch (e) {
          options = undefined
          skipNext = false
        }
      }
      else if (start) {
        // console.log({ item })
        line += (
          // !item
          item.endsWith('\n'))
        || IS_OPTION(next)
        || IS_BEGIN(next)
          ? `${item}`
          : `${item}\n`
      }
    }
    // console.log({ snapshots })
    return new Snapshots(...snapshots)
  }

  static fromString_old(raw: string) {
    let parts = raw
      .split(SNAP_SEPARATOR_MATCHER)
      // .slice(1, -1) // remove header and tailing
    // console.log({ raw, q: replaceAll(raw, eol, '\n'), eol, parts })
    parts = parts.slice(1, -1)
    const snapshots: Snapshot[] = []
    for (let i = 0; i < parts.length; i += 1) {
      const [content, optionsRaw] = parts[i].split(SNAP_SEPARATOR_MATCHER_OPTIONS)
      const snap: Snapshot = {
        content,
      }
      if (optionsRaw?.trim())
        snap.options = JSON.parse(optionsRaw)

      snapshots.push(snap)
    }

    return new Snapshots(...snapshots)
  }

  *animate(): Generator<AnimatorStep> {
    let lastContent: string | undefined
    const copy: Snapshot[] = [...this]

    for (let index = 0; index < copy.length; index++) {
      const snap = copy[index]
      if (lastContent === undefined) {
        lastContent = snap.content
        yield {
          type: 'init',
          content: lastContent,
        }
        continue
      }

      yield {
        type: 'new-snap',
        snap,
        index,
      }
      // form last to current, generate animator array
      const animator = simpleAnimator(lastContent, snap.content)
      for (const result of animator)
        yield result

      lastContent = snap.content
    }
  }
}

export type SnapshotFallbackLoader = (id: string) => Snapshots | undefined | Promise<Snapshots | undefined>
export interface SnapshotsManagerOptions {
  ensureFallback?: SnapshotFallbackLoader
}

/**
 * manage Snapshots
 */
export class SnapshotsManager extends Map<string, Snapshots> {
  constructor(
    public options: SnapshotsManagerOptions,
  ) {
    super()
  }

  /**
   * set snapshot by id, if no present, read load callback or create new snapshot
   * @param id
   * @param load
   */
  async ensure(id: string, load = this.options.ensureFallback): Promise<Snapshots> {
    if (!this.has(id))
      this.set(id, await load?.(id) || new Snapshots())

    return this.get(id)!
  }
}
