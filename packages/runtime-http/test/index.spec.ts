import { createHandler, get } from '../src/'

function createMockTransport() {
  return (observer: any) => {
    observer.next({})
  }
}

describe('@transclusion/runtime-http', () => {
  describe('get', () => {
    it('should create get command message', () => {
      const cmdMsg = get('/')

      expect(cmdMsg).toEqual({
        type: 'http/GET',
        url: '/',
        opts: {}
      })
    })
  })

  describe('handler', () => {
    it('should create handler', () => {
      const h = createHandler({
        transport: createMockTransport()
      })

      expect(Object.keys(h)).toEqual(['http/ABORT', 'http/GET'])
    })
  })
})
