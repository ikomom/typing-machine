import { calculatePatches, diffString, sliceInput } from './index'
import type { AnimatorStep, Patch } from './index'

export function* animatePatches(input: string, patches: Patch[]): Generator<AnimatorStep> {
  let content = input
  // 当前游标
  let cursor = 0
  // 每次只关注添加、删除的位置, 并且拼接起来
  for (let index = 0; index < patches.length; index++) {
    const patch = patches[index]
    const head = content.slice(0, patch.cursor)

    yield { type: 'new-patch', patch, index }

    if (patch.type === 'insert') {
      // 光标从头部插入
      cursor = patch.cursor
      const tail = content.slice(patch.cursor)
      // 模拟动画过程
      yield { type: 'insert-start', cursor, content }
      for (const { char, output, cursor: delta } of animateInsertionSlices(patch.content)) {
        yield {
          type: 'insert',
          cursor: cursor + delta,
          content: head + output + tail,
          char,
        }
      }
      content = head + patch.content + tail
      yield { type: 'insert-end', cursor, content }
    }
    else if (patch.type === 'removal') {
      // 光标从尾部开始减小
      cursor = patch.cursor + patch.length
      const tail = content.slice(patch.cursor + patch.length)
      const selection = content.slice(patch.cursor, patch.cursor + patch.length)
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

  yield { type: 'animator-finish', content }
}

export function *animateInsertionSlices(input: string) {
  const slices = sliceInput(input)
  let output = ''
  for (const { content, cursor } of slices) {
    const head = output.slice(0, cursor)
    const tail = output.slice(cursor)

    let body = ''
    for (const char of content) {
      body += char
      // console.log('body', { body, char })
      yield {
        char,
        output: head + body + tail,
        cursor: cursor + body.length,
      }
    }
    output = head + content + tail
  }
}

export function animateTo(input: string, output: string) {
  const delta = diffString(input, output)
  const patches = calculatePatches(delta)
  return animatePatches(input, patches)
}

/**
 * TODO: 用法成疑
 * @param input
 * @param patches
 */
export function applyPatches(input: string, patches: Patch[]) {
  // 每次只关注添加、删除的位置, 并且拼接起来
  for (const patch of animatePatches(input, patches)) {
    if (patch.type === 'animator-finish')
      return patch.content
  }
  return input
}
