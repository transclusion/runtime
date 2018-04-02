import {createVElement} from '@transclusion/vdom'
import {run} from '../src'

describe('runtime-server', () => {
  it('should run a simple program', async () => {
    const context = await run({
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
    })

    expect(context.model).toEqual(0)
    expect(context.html).toEqual('<div>0</div>')
  })

  it('should run a program which executes commands', async () => {
    const mockFn = jest.fn()

    const context = await run({
      handlers: [
        {
          LOAD: (cmd, handleMsg) => {
            handleMsg({type: 'LOAD_SUCCESS', value: 10})
          }
        }
      ],
      program: {
        init() {
          return [0, {type: 'LOAD'}]
        },
        update(model, msg) {
          mockFn(model, msg)
          switch (msg.type) {
            case 'LOAD_SUCCESS':
              return [msg.value, null]

            default:
              return [model, null]
          }
        },
        view(model) {
          mockFn(model)
          return <div>{model}</div>
        }
      }
    })

    expect(mockFn.mock.calls).toEqual([[0], [0, {type: 'LOAD_SUCCESS', value: 10}], [10]])

    expect(context.model).toEqual(10)
    expect(context.html).toEqual('<div>10</div>')
  })

  it('should run a program which executes nested commands', async () => {
    const mockFn = jest.fn()

    const context = await run({
      handlers: [
        {
          LOAD: (cmd, handleMsg, handleCmd) => {
            return handleCmd({type: 'NESTED'})
          },
          NESTED: (cmd, handleMsg) => {
            handleMsg({type: 'NESTED_SUCCESS', value: 10})
          }
        }
      ],
      program: {
        init() {
          return [0, {type: 'LOAD'}]
        },
        update(model, msg) {
          mockFn(model, msg)
          switch (msg.type) {
            case 'NESTED_SUCCESS':
              return [msg.value, null]

            default:
              return [model, null]
          }
        },
        view(model) {
          mockFn(model)
          return <div>{model}</div>
        }
      }
    })

    expect(mockFn.mock.calls).toEqual([[0], [0, {type: 'NESTED_SUCCESS', value: 10}], [10]])

    expect(context.model).toEqual(10)
    expect(context.html).toEqual('<div>10</div>')
  })
})
