import {createVElement, diff} from '@transclusion/vdom'
import {run} from '../src'
import * as mockWorker from './mocks/worker'

describe('runtime-browser', () => {
  it('should mount and patch initial DOM', () => {
    expect.assertions(1)

    const element = document.createElement('div')
    const props: any = {}
    const worker = mockWorker.create((msg: string) => {
      const payload = JSON.parse(msg)

      switch (payload.type) {
        case 'MOUNT':
          worker.send({
            patches: diff(
              payload.vNode,
              <div>
                <h1>Hello, world</h1>
              </div>
            ),
            ports: {},
            type: 'INIT'
          })
          break

        default:
          break
      }
    })

    return run(
      {
        element,
        props,
        worker
      },
      () => {
        expect(element.outerHTML).toEqual('<div><h1>Hello, world</h1></div>')
      }
    )
  })

  it('should patch DOM', () => {
    expect.assertions(1)

    const element = document.createElement('div')
    const props: any = {}
    const worker = mockWorker.create((msg: string) => {
      const payload = JSON.parse(msg)

      switch (payload.type) {
        case 'MOUNT':
          worker.send({
            patches: [],
            ports: {},
            type: 'INIT'
          })
          break

        default:
          break
      }
    })

    return run(
      {
        element,
        props,
        worker
      },
      () => {
        worker.send({
          patches: diff(
            <div />,
            <div>
              <h1>Hello, world</h1>
            </div>
          ),
          type: 'PATCH'
        })

        expect(element.outerHTML).toEqual('<div><h1>Hello, world</h1></div>')
      }
    )
  })

  it('should receive message through ports', () => {
    expect.assertions(2)

    interface IPushState {
      type: 'PUSH_STATE'
    }

    const element = document.createElement('div')
    const props: any = {}
    const worker = mockWorker.create((msg: string) => {
      const payload = JSON.parse(msg)

      switch (payload.type) {
        case 'MOUNT':
          worker.send({
            patches: [],
            ports: {
              history: ['PUSH_STATE']
            },
            type: 'INIT'
          })
          break

        default:
          break
      }
    })

    return run(
      {
        element,
        props,
        worker
      },
      context => {
        expect(context.ports.history).toBeDefined()

        context.ports.history.subscribe((msg: IPushState) => {
          expect(msg.type).toEqual('PUSH_STATE')
        })

        worker.send({
          msg: {type: 'PUSH_STATE'},
          type: 'PORT_MSG'
        })
      }
    )
  })

  it('should send message through ports', () => {
    expect.assertions(2)

    const element = document.createElement('div')
    const props: any = {}
    const worker = mockWorker.create((msg: string) => {
      const payload = JSON.parse(msg)

      switch (payload.type) {
        case 'MOUNT':
          worker.send({
            patches: [],
            ports: {
              history: ['POP_STATE']
            },
            type: 'INIT'
          })
          break

        case 'MSG':
          expect(payload.msg.type).toEqual('POP_STATE')
          break

        default:
          break
      }
    })

    return run(
      {
        element,
        props,
        worker
      },
      context => {
        expect(context.ports.history).toBeDefined()
        context.ports.history.send({type: 'POP_STATE'})
      }
    )
  })
})
