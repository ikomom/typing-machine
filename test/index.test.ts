import type { Diff } from 'diff-match-patch-typescript'
import { DiffMatchPatch, DiffOperation } from 'diff-match-patch-typescript'
import { describe, expect, it } from 'vitest'

const input = `
import { describe, expect, it } from 'vitest'
import {ll} from './one'

describe('should', () => {
  it('exported', () => {
    expect(33)
    console.log('hello')
  })
})
`

const output = `
import { describe, expect, it } from 'vitest'

describe('should', () => {
  it('exported', () => {
    expect(33).toEqual(1)
  })
})
`

interface InsertPatch {
  type: 'insert'
  // 删除开始位置
  from: number
  text: string
}
interface RemovalPatch {
  type: 'removal'
  // 删除开始位置
  from: number
  length: number
}

type Patch = InsertPatch | RemovalPatch

function calculatePatches(diffs: Diff[]): Patch[] {
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
        // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // // @ts-expect-error
        // text, // TODO: 测试用, 待移除
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

function diffString(a: string, b: string): Diff[] {
  const diff = new DiffMatchPatch()
  const res = diff.diff_main(a, b)
  diff.diff_cleanupSemantic(res)
  return res
}

function applyPatches(input: string, patches: Patch[]) {
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

describe('should', () => {
  it('diff', () => {
    const delta = diffString(input, output)
    expect(delta).toMatchSnapshot('delta')
    const patches = calculatePatches(delta)
    expect(patches).toMatchSnapshot('patches')
    const applied = applyPatches(input, patches)
    expect(applied).toMatchSnapshot('output')
    expect(applied).toEqual(output)
  })
})
