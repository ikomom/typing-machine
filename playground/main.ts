import { calculatePatches, createAnimator, diffString } from '../src/core'

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
const startBtn = document.getElementById('btn-start') as HTMLButtonElement
const resetBtn = document.getElementById('btn-reset') as HTMLButtonElement

inputEl.value = input
outputEl.value = output

inputEl.addEventListener('input', () => {
  input = inputEl.value
})

outputEl.addEventListener('input', () => {
  output = outputEl.value
})

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true
  await start()
  startBtn.disabled = false
})
resetBtn.addEventListener('click', () => reset())

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function reset() {

}

async function start() {
  reset()
  const _input = input
  const delta = diffString(_input, output)
  const patches = calculatePatches(delta)
  const animator = createAnimator(_input, patches)

  for (const result of animator) {
    typingEl.textContent = result.output
    await sleep(Math.random() * 100)
  }
}
