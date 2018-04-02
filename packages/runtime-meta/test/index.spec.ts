import { set } from '../src/browser'

describe('@transclusion/runtime-meta', () => {
  it('should create set message', () => {
    const cmdMsg = set({ title: 'Foo' })

    expect(cmdMsg).toEqual({
      type: 'meta/SET',
      meta: { title: 'Foo' }
    })
  })
})
