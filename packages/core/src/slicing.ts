import type { Slice } from './types'

const pairs = [
  ['{', '}'],
  ['(', ')'],
  ['[', ']'],
  ['<', '>'],
  ['`', '`'],
  ['\'', '\''],
  ['"', '"'],
]
const chars = '(){}\\[\\]<>\'"`'
const splitRegex = new RegExp(`(\s*[${chars}]\s*)`)

/**
 * slide input by pairs
 * @param input
 */
export function sliceInput(input: string): Slice[] {
  if (!input)
    return []
  // const rest = input.split(/\r?\n/).join('')
  const tailingNewLines = input.match(/\n+$/m)?.[0] || ''
  const rest = tailingNewLines.length
    ? input.slice(0, -tailingNewLines.length)
    : input

  // string slice
  const strings = rest.split(splitRegex).filter(Boolean)

  let index = 0
  const slices = strings
    .map((s, idx) => {
      const trimmed = s.trim()
      const pair = pairs.find(i => i[1] === trimmed)
      // pair before 2 index
      const order = (pair && strings[idx - 2]?.trim() === pair[0]) ? idx - 2 : idx

      const _index = index
      index += s.length

      return {
        content: s,
        order,
        cursor: _index,
      }
    }).sort((a, b) => a.order - b.order)

  let cursor = 0
  slices.forEach((i) => {
    i.cursor = Math.min(i.cursor, cursor)
    cursor += i.content.length
  })
  if (tailingNewLines.length) {
    slices.unshift({
      content: tailingNewLines,
      order: -1,
      cursor: 0,
    })
  }
  // console.log({ slices: [...slices], strings })
  return slices
}
