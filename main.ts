import _TypeIt from 'typeit'
import { calculatePatches, diffString } from './src'

const TypeIt = _TypeIt as any
let input = `
import { describe, expect, it } from 'vitest'
import {ll} from './one'

describe('should', () => {
  it('exported', () => {
    expect(33)
    console.log('hello')
  })
})
`
let output = `
import { describe, expect, it } from 'vitest'

describe('should', () => {
  it('exported', () => {
    expect(33).toEqual(1)
  })
})
`

const typingEl = document.getElementById('typing') as HTMLPreElement
const inputEl = document.getElementById('input') as HTMLTextAreaElement
const outputEl = document.getElementById('output') as HTMLTextAreaElement

inputEl.value = input
outputEl.value = output

inputEl.addEventListener('input', () => {
  input = inputEl.value
})

outputEl.addEventListener('input', () => {
  output = outputEl.value
});

(document.getElementById('btn-start') as HTMLButtonElement).addEventListener('click', () => start());
(document.getElementById('btn-reset') as HTMLButtonElement).addEventListener('click', () => reset())

let typeit: any
function reset() {
  if (typeit) {
    typeit.reset()
    typeit = null
  }
}

function start() {
  reset()

  const delta = diffString(input, output)
  const patches = calculatePatches(delta)

  typeit = new TypeIt(typingEl, {
    speed: 50,
  })

  typeit.type(input, { instant: true })

  for (const patch of patches) {
    if (patch.type === 'insert') {
      typeit
        .move(null, { to: 'START', instant: true })
        .move(patch.from, { instant: true })
        .type(patch.text)
    }

    else if (patch.type === 'removal') {
      typeit
        .move(null, { to: 'START', instant: true })
        .move(patch.from + patch.length, { instant: true })
        .delete(patch.length)
    }
  }

  typeit
    .move(null, { to: 'END', instant: false })
    .go()
}
