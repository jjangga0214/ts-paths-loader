import { resolve } from '#/index.js'
import { dirname } from 'dirname-filename-esm'
import upath from 'upath'

describe('resolve', () => {
  test('entrypoint', async () => {
    const filename = upath.resolve(dirname(import.meta), '../src/index.js')
    const entrypoint = `file://${filename}`
    const context = {
      conditions: ['node', 'import', 'node-addons'],
      importAssertions: {}, // [Object: null prototype]
      parentURL: undefined,
    }
    const module = await resolve(entrypoint, context)
    await expect(module).toBe('')
  })
})
