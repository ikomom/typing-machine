import { describe, expect, it } from 'vitest'
import { calculatePatches, diffString, simpleAnimator } from '../src'
import { input, output, snapsData } from './fixture'

describe('animator', () => {
  it('generate', () => {
    const animator = simpleAnimator(input, output)
    expect([...animator]).toMatchSnapshot('animator')
  })

  it('animator snap', () => {
    const data = [
      {
        content: '',
      },
      {
        content: 'import {create} from \'vue\'',
      },
      {
        content: 'import {App} from \'vue\'',
      },
      {
        content: 'import {App} from \'vue\'\n\nexport function Test() {\n    \n}\n',
      },
    ]
    const delta = diffString(data[2].content, data[3].content)
    console.log({ delta })
    const patches = calculatePatches(delta)
    console.log({ patches })
  })
})
