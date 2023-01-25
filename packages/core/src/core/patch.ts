import { DiffMatchPatch, DiffOperation } from 'diff-match-patch-typescript'
import type { Diff } from 'diff-match-patch-typescript'
import type { Patch } from './types'

export function calculatePatches(diffs: Diff[]): Patch[] {
  const patches: Patch[] = []
  // 当前文字的index
  let cursor = 0
  for (const change of diffs) {
    const [operation, text] = change
    const offset = text.length
    if (operation === DiffOperation.DIFF_EQUAL) {
      cursor += offset
    }
    else if (operation === DiffOperation.DIFF_DELETE) {
      patches.push({
        type: 'removal',
        from: cursor,
        length: offset,
      })
      // 删除时，游标还是一样，所以不用移动，一下代码不用
      // cursor -= offset
    }
    else if (operation === DiffOperation.DIFF_INSERT) {
      patches.push({
        type: 'insert',
        from: cursor,
        text,
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

export function diffString(a: string, b: string): Diff[] {
  const diff = new DiffMatchPatch()
  const res = diff.diff_main(a, b)
  diff.diff_cleanupSemantic(res)
  return res
}

export function applyPatches(input: string, patches: Patch[]) {
  let output = input
  // 每次只关注添加、删除的位置, 并且拼接起来
  for (const patch of patches) {
    const head = output.slice(0, patch.from)
    if (patch.type === 'insert') {
      const tail = output.slice(patch.from)
      output = head + patch.text + tail
    }
    else if (patch.type === 'removal') {
      const tail = output.slice(patch.from + patch.length)
      output = head + tail
    }
  }
  return output
}
