import { DiffMatchPatch, DiffOperation } from 'diff-match-patch-typescript'
import type { Diff } from 'diff-match-patch-typescript'
import type { Patch } from './types'

export function diffString(a: string, b: string): Diff[] {
  const diff = new DiffMatchPatch()
  const res = diff.diff_main(a, b)
  diff.diff_cleanupSemantic(res)
  return res
}

export function calculatePatches(diffs: Diff[]): Patch[] {
  const patches: Patch[] = []
  // 当前文字的index
  let cursor = 0
  for (const change of diffs) {
    const [operation, content] = change
    const offset = content.length
    if (operation === DiffOperation.DIFF_EQUAL) {
      cursor += offset
    }
    else if (operation === DiffOperation.DIFF_DELETE) {
      patches.push({
        type: 'removal',
        cursor,
        length: offset,
      })
      // 删除时，游标还是一样，所以不用移动，一下代码不用
      // cursor -= offset
    }
    else if (operation === DiffOperation.DIFF_INSERT) {
      patches.push({
        type: 'insert',
        cursor,
        content,
      })
      // 添加时, 游标 = 之前游标 + 添加长度
      cursor += offset
    }
    else {
      throw new Error('unknown change type')
    }
  }
  return patches
}
