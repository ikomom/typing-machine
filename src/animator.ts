import type { Patch } from './index'

export function* createAnimator(input: string, patches: Patch[]) {
  let output = input
  // 当前游标
  let cursor = 0
  // 每次只关注添加、删除的位置, 并且拼接起来
  for (const patch of patches) {
    const head = output.slice(0, patch.from)

    if (patch.type === 'insert') {
      // 光标从头部插入
      cursor = patch.from
      const tail = output.slice(patch.from)
      // 模拟动画过程
      let selection = ''
      yield { type: 'insert-start', cursor, output }
      for (const char of patch.text) {
        selection += char
        yield {
          type: 'insert-ing',
          cursor: cursor + selection.length,
          output: head + selection + tail,
        }
      }
      output = head + patch.text + tail
      yield { type: 'insert-end', cursor, output }
    }
    else if (patch.type === 'removal') {
      // 光标从尾部开始减小
      cursor = patch.from + patch.length
      const tail = output.slice(patch.from + patch.length)
      const selection = output.slice(patch.from, patch.from + patch.length)
      yield { type: 'removal-start', cursor, output }

      for (let i = selection.length; i >= 0; i--) {
        yield {
          type: 'removal-ing',
          cursor: cursor - (selection.length - i),
          output: head + selection.slice(0, i) + tail,
        }
      }
      output = head + tail
      yield { type: 'removal-end', cursor, output }
    }
  }
  return output
}

