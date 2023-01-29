import { simpleAnimator } from './animator'
import type { AnimatorStep, Snapshot } from './types'
import { replaceAll } from './utils'

export const SNAP_HEADING = 'ik-typing-machine Snapshots v1'
export const SNAP_SEPARATOR_PRE = '-'.repeat(2)
export const SNAP_SEPARATOR_SUFFIX = '-'.repeat(10)
export const SNAP_SEPARATOR_OPTIONS = '----OPTIONS----'
export const SNAP_SEPARATOR = `${SNAP_SEPARATOR_PRE}--${SNAP_SEPARATOR_SUFFIX}`
export const snapSeparatorMatcher = (eol: string) => new RegExp(`${eol}?${SNAP_SEPARATOR_PRE}[#\\w-]*${SNAP_SEPARATOR_SUFFIX}${eol}`, 'g')
export const snapSeparatorMatcherOptions = (eol: string) => new RegExp(`${eol}?${SNAP_SEPARATOR_OPTIONS}`, 'g')

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

  toString(eol = '\n'): string {
    return [
      SNAP_HEADING + eol,
      ...this.flatMap((snap, i) => {
        return [
          `${SNAP_SEPARATOR_PRE + String(i + 1).padStart(2, '0') + SNAP_SEPARATOR_SUFFIX}`,
          snap.content,
          ...(snap.options
            ? [
                SNAP_SEPARATOR_OPTIONS,
                Object.keys(snap.options).length > 1
                  ? JSON.stringify(snap.options, null, 2)
                  : JSON.stringify(snap.options)]
            : []),
        ]
      }),
      SNAP_SEPARATOR,
      '',
    ].join(eol)
  }

  static fromRawStr(raw: string) {
    const parts = raw.split('\r?\n')
  }

  static fromString(raw: string, eol = '\n') {
    let parts = raw
      .split(snapSeparatorMatcher(eol))
      // .slice(1, -1) // remove header and tailing
    // console.log({ raw, q: replaceAll(raw, eol, '\n'), eol, parts })
    parts = parts.slice(1, -1)
    const snapshots: Snapshot[] = []
    for (let i = 0; i < parts.length; i += 1) {
      const [content, optionsRaw] = parts[i].split(snapSeparatorMatcherOptions(eol))
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
export interface SnapshotManagerOptions {
  ensureFallback?: SnapshotFallbackLoader
}

export class SnapshotManager extends Map<string, Snapshots> {
  constructor(
    public options: SnapshotManagerOptions,
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
