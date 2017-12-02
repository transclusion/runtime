import {IMsg} from '@transclusion/runtime-core'
import {mount, patch, toVNode} from '@transclusion/vdom'
import {createPort} from './createPort'
import {IContext, IInitWorkerMsg, IOpts, IPatchWorkerMsg, IPortMsgWorkerMsg, IPorts, WorkerMsg} from './types'

export function run<Props>(opts: IOpts<Props>, handleContext?: (context: IContext) => void) {
  const {props, worker} = opts
  const ports: IPorts = {}

  let element: any = opts.element
  let isMounted = false

  function postMessage (msg: any) {
    worker.postMessage(JSON.stringify(msg))
  }

  function handleEvent(eventType: string, event: Event, eventValue: IMsg) {
    if (typeof eventValue === 'object' && eventValue.preventDefault) {
      event.preventDefault()
    }

    const target: any = event.target

    switch (event.type) {
      case 'input':
        eventValue.value = target.value
        postMessage({type: 'MSG', msg: eventValue})
        break

      default:
        postMessage({type: 'MSG', msg: eventValue})
        break
    }
  }

  function handleHook(hookElement: Element, hookValue: IMsg) {
    postMessage({type: 'MSG', msg: hookValue})
  }

  const workerMsgHandlers = {
    INIT(workerMsg: IInitWorkerMsg) {
      if (!isMounted) {
        isMounted = true

        // Create ports
        Object.keys(workerMsg.ports).forEach(
          key =>
            (ports[key] = createPort(workerMsg.ports[key], (msg: IMsg) =>
              postMessage({type: 'PORT_MSG', msg})
            ))
        )

        mount(element, workerMsg.vNode, handleEvent)
        element = patch(element, workerMsg.patches, handleEvent, handleHook)

        if (handleContext) {
          handleContext({ports})
        }
      }
    },

    PATCH(workerMsg: IPatchWorkerMsg) {
      element = patch(element, workerMsg.patches, handleEvent, handleHook)
    },

    PORT_MSG(workerMsg: IPortMsgWorkerMsg) {
      Object.keys(ports).forEach(key => ports[key].next(workerMsg.msg))
    }
  }

  worker.addEventListener('message', event => {
    const workerMsg: WorkerMsg = JSON.parse(event.data)

    if (workerMsgHandlers[workerMsg.type]) {
      ;(workerMsgHandlers[workerMsg.type] as any)(workerMsg)
    }
  })

  postMessage({type: 'MOUNT', props, vNode: toVNode(element)})
}
