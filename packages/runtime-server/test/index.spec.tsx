import {createVElement} from '@transclusion/vdom'
import {run} from '../src'

describe('runtime-server', () => {
  it('should render a simple component', () => {
    return run({
      program: {
        init() {
          return [0, null]
        },
        update(model, msg) {
          return [model, null]
        },
        view(model) {
          return <div>{model}</div>
        }
      }
    }).then(({model, html}) => {
      expect(model).toEqual(0)
      expect(html).toEqual('<div>0</div>')
    })
  })
})
