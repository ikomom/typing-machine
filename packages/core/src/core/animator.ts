import { calculatePatches, diffString } from './index'
import type { AnimatorStep, Patch } from './index'

export function* createAnimator(input: string, patches: Patch[]): Generator<AnimatorStep> {
  let content = input
  // 当前游标
  let cursor = 0
  // 每次只关注添加、删除的位置, 并且拼接起来
  for (let index = 0; index < patches.length; index++) {
    const patch = patches[index]
    const head = content.slice(0, patch.from)

    yield { type: 'new-patch', patch, index }

    if (patch.type === 'insert') {
      // 光标从头部插入
      cursor = patch.from
      const tail = content.slice(patch.from)
      // 模拟动画过程
      let selection = ''
      yield { type: 'insert-start', cursor, content }
      for (const char of patch.text) {
        selection += char
        yield {
          type: 'insert',
          cursor: cursor + selection.length,
          content: head + selection + tail,
          char,
        }
      }
      content = head + patch.text + tail
      yield { type: 'insert-end', cursor, content }
    }
    else if (patch.type === 'removal') {
      // 光标从尾部开始减小
      cursor = patch.from + patch.length
      const tail = content.slice(patch.from + patch.length)
      const selection = content.slice(patch.from, patch.from + patch.length)
      yield { type: 'removal-start', cursor, content }

      for (let i = selection.length - 1; i >= 0; i--) {
        yield {
          type: 'removal',
          cursor: cursor - (selection.length - i),
          content: head + selection.slice(0, i) + tail,
        }
      }
      content = head + tail
      yield { type: 'removal-end', cursor, content }
    }
  }
}

export function simpleAnimator(input: string, output: string) {
  const delta = diffString(input, output)
  const patches = calculatePatches(delta)
  return createAnimator(input, patches)
}
