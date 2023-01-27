import { simpleAnimator } from './animator'
import type { AnimatorStep, Snapshot } from './types'

export const SNAP_HEADING = 'ik-typing-machine Snapshots v1\n'
export const SNAP_SEPARATOR_PRE = '-'.repeat(2)
export const SNAP_SEPARATOR_SUFFIX = '-'.repeat(10)
export const SNAP_SEPARATOR = `${SNAP_SEPARATOR_PRE}--${SNAP_SEPARATOR_SUFFIX}`
export const SNAP_SEPARATOR_MATCHER = new RegExp(`\\n?${SNAP_SEPARATOR_PRE}[#\\w-]*${SNAP_SEPARATOR_SUFFIX}\\n`, 'g')

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
      SNAP_HEADING,
      ...this.flatMap((snap, i) => {
        return [
          `${SNAP_SEPARATOR_PRE + String(i + 1).padStart(2, '0') + SNAP_SEPARATOR_SUFFIX}`,
          snap.content,
          SNAP_SEPARATOR,
          snap.options ? JSON.stringify(snap.options, null, 2) : undefined,
        ].filter(i => i !== undefined)
      }),
      SNAP_SEPARATOR,
      '',
    ].join('\n')
  }

  static fromString(raw: string) {
    const parts = raw
      .split(SNAP_SEPARATOR_MATCHER)
      .slice(1, -1) // remove header and tailing

    const snapshots: Snapshot[] = []
    for (let i = 0; i < parts.length; i += 2) {
      const snap: Snapshot = {
        content: parts[i],
      }
      const optionsRaw = parts[i + 1].trim()

      if (optionsRaw)
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
