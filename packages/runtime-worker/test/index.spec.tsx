import {createVElement} from '@transclusion/vdom'
import {run} from '../src'
import {IHandlerSet, IProgram} from '../src/types'
import * as mockScope from './mocks/scope'

describe('runtime-worker', () => {
  it('should mount and send initial virtual DOM patches', () => {
    expect.assertions(11)

    const handlers: IHandlerSet[] = [
      {
        LOAD(cmd) {
          expect(cmd.type).toEqual('LOAD')
        }
      }
    ]

    const program: IProgram<any, any> = {
      init(props) {
        return [{path: props.path}, {type: 'LOAD'}]
      },
      ports: {
        history: ['POP_STATE']
      },
      view({path}) {
        return <div>{path}</div>
      },
      update(model, msg) {
        switch (msg.type) {
          case 'POP_STATE':
            return [{...model, path: msg.path}, {type: 'LOAD'}]
          default:
            return [model, null]
        }
      }
    }

    const scope = mockScope.create(data => {
      const workerMsg = JSON.parse(data)

      switch (workerMsg.type) {
        case 'INIT':
          expect(workerMsg.patches).toHaveLength(1)
          expect(workerMsg.patches[0][0]).toEqual(2)
          expect(workerMsg.patches[0][1]).toEqual('/blog')
          expect(workerMsg.ports).toEqual({history: ['POP_STATE']})
          break

        case 'PATCH':
          expect(workerMsg.patches).toHaveLength(2)
          expect(workerMsg.patches[0][0]).toEqual(1)
          expect(workerMsg.patches[0][1]).toEqual(0)
          expect(workerMsg.patches[1][0]).toEqual(7)
          expect(workerMsg.patches[1][1]).toEqual('/')
          break
      }
    })

    run({
      handlers,
      program,
      scope
    })

    scope.send({type: 'MOUNT', props: {path: '/blog'}, vNode: <div />})
    scope.send({type: 'MSG', msg: {type: 'POP_STATE', path: '/'}})
  })
})
