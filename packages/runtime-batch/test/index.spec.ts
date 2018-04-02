import { batch, handler } from '../src/'

const noop = () => void 0

const delay = delayMs => new Promise(resolve => setTimeout(resolve, delayMs))

describe('@transclusion/runtime-batch', () => {
  it('should create batch message', () => {
    const cmdMsg = batch({ type: 'FOO' }, { type: 'BAR' })

    expect(cmdMsg).toEqual({
      cmdMsgs: [{ type: 'FOO' }, { type: 'BAR' }],
      type: 'BATCH'
    })
  })

  it('should handle batch commands', async () => {
    const cmdMsg = batch({ type: 'FOO' }, { type: 'BAR' })
    const mockFn = jest.fn()

    await handler.BATCH(cmdMsg, noop, cmd => {
      mockFn(cmd)
      return delay(100).then(() => {
        mockFn(null)
        return
      })
    })

    expect(mockFn.mock.calls).toEqual([
      [{ type: 'FOO' }],
      [{ type: 'BAR' }],
      [null],
      [null]
    ])
  })
})
