// import { calculatePatches, createAnimator, diffString } from '../packages/core/src'

// import { Snapshots } from '../packages/core/src'

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

// const typingEl = document.getElementById('typing') as HTMLPreElement
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

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

function reset() {

}
// const raw = 'ik-typing-machine Snapshots v1\r\n'
//   + '\r\n'
//   + '--01----------\r\n'
//   + '--02----------\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + '--03----------\r\n'
//   + 'import { } from \'vue\'\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + '--04----------\r\n'
//   + 'import { createApp } from \'vue\'\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + 'const app = createApp(App)\r\n'
//   + 'app.mount(\'#app\')\r\n'
//   + '\r\n'
//   + '--05----------\r\n'
//   + 'import { createApp } from \'vue\'\r\n'
//   + 'import { createRouter } from \'vue-router\'\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + 'const app = createApp(App)\r\n'
//   + 'const router = createRouter()\r\n'
//   + 'app.use(router)\r\n'
//   + 'app.mount(\'#app\')\r\n'
//   + '\r\n'
//   + '--06----------\r\n'
//   + 'import { createApp } from \'vue\'\r\n'
//   + 'import { createRouter, createWebHistory } from \'vue-router\'\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + 'const app = createApp(App)\r\n'
//   + 'const router = createRouter({\r\n'
//   + '  history: createWebHistory(),\r\n'
//   + '})\r\n'
//   + 'app.use(router)\r\n'
//   + 'app.mount(\'#app\')\r\n'
//   + '\r\n'
//   + '--07----------\r\n'
//   + 'import { createApp } from \'vue\'\r\n'
//   + 'import { createRouter, createWebHistory } from \'vue-router\'\r\n'
//   + 'import routes from \'virtual:generated-pages\'\r\n'
//   + 'import App from \'./App.vue\'\r\n'
//   + '\r\n'
//   + 'const app = createApp(App)\r\n'
//   + 'const router = createRouter({\r\n'
//   + '  history: createWebHistory(),\r\n'
//   + '  routes,\r\n'
//   + '})\r\n'
//   + 'app.use(router)\r\n'
//   + 'app.mount(\'#app\')\r\n'
//   + '\r\n'
//   + '--------------\r\n'
// const eol = '\r\n'
// const de = Snapshots.fromString(raw, eol)
// console.log('Snapshots.fromString(window.raw)', de)
// const qaw = new Snapshots(...de).toString(eol)
//
// console.log({ eq: qaw === raw, qaw, raw })

async function start() {
  reset()

  // const _input = input
  // const delta = diffString(_input, output)
  // const patches = calculatePatches(delta)
  // const animator = createAnimator(_input, patches)

  // for (const result of animator) {
  // typingEl.textContent = result.content
  // await sleep(Math.random() * 100)
  // }
}
