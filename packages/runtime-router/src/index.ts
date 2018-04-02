import { IPorts } from '@transclusion/runtime-browser'
import { IMsg } from '@transclusion/runtime-core'
import * as program from './program'
import { IDispose, IPushStateMsg, ITransitionMap, Msg } from './types'

export { IDispose }

export function pushState(path: string, transition?: IMsg): IPushStateMsg {
  return {
    type: 'router/PUSH_STATE',
    path,
    preventDefault: true,
    transition
  }
}

export function handlePorts(ports: IPorts, transitions?: ITransitionMap) {
  if (!ports.router) {
    throw new Error('Missing `router` port')
  }

  // Handle commands/messages
  ports.router.subscribe((msg: Msg) => {
    switch (msg.type) {
      case 'router/PUSH_STATE': {
        const done = () => {
          ports.router.send({
            type: 'router/TRANSITION_DONE',
            transition: msg.transition
          })
        }

        if (transitions && msg.transition) {
          const { transition } = msg
          const transitionFn = (transitions as any)[transition.type]

          if (transitionFn) {
            transitionFn(transition, done)
          }
        } else {
          done()
        }

        history.pushState(null, document.title, msg.path)
        break
      }
    }
  })

  // Trigger `POP_STATE` message
  window.addEventListener('popstate', () => {
    ports.router.send({ type: 'router/POP_STATE', path: location.pathname })
  })
}

export { program }
