import {IMsg} from '@transclusion/runtime-core'
import {diff, VNode} from '@transclusion/vdom'
import {IMessageEvent, IMountScopeMsg, IMsgScopeMsg, IOpts, IPortMsgScopeMsg, ScopeMsg} from './types'

export function run<Props, Model>(opts: IOpts<Props, Model>) {
  const {program, scope} = opts
  const handlers = opts.handlers || []
  const ports = program.ports || {}

  let vNode: VNode
  let model: Model
  let cmd: IMsg | null = null

  function handleCmd(cmdMsg: IMsg) {
    let isHandled = false

    handlers.forEach(handler => {
      if (handler[cmdMsg.type]) {
        isHandled = true
        handler[cmdMsg.type](cmdMsg, handleMsg, handleCmd)
      }
    })

    Object.keys(ports).forEach(key => {
      if (ports[key].indexOf(cmdMsg.type) > -1) {
        isHandled = true
        scope.postMessage(JSON.stringify({type: 'PORT_MSG', msg: cmdMsg}))
      }
    })

    if (!isHandled) {
      // tslint:disable-next-line no-console
      console.warn(`Missing handler for command type: ${cmdMsg.type}`)
    }
  }

  function handleMsg(msg: IMsg) {
    Object.keys(ports).forEach(key => {
      if (ports[key].indexOf(msg.type) > -1) {
        scope.postMessage(JSON.stringify({type: 'PORT_MSG', msg}))
      }
    })
    ;[model, cmd] = program.update(model, msg)

    const nextVNode = program.view(model)
    const patches = diff(vNode, nextVNode)

    vNode = nextVNode

    scope.postMessage(JSON.stringify({type: 'PATCH', patches}))

    if (cmd) {
      handleCmd(cmd)
      cmd = null
    }
  }

  const scopeMsgHandlers = {
    MOUNT(scopeMsg: IMountScopeMsg) {
      vNode = scopeMsg.vNode
      ;[model, cmd] = program.init(scopeMsg.props)

      const nextVNode = program.view(model)
      const patches = diff(vNode, nextVNode)

      vNode = nextVNode

      scope.postMessage(JSON.stringify({type: 'INIT', patches, ports, vNode}))

      if (cmd) {
        handleCmd(cmd)
        cmd = null
      }
    },

    MSG(scopeMsg: IMsgScopeMsg) {
      handleMsg(scopeMsg.msg)
    },

    PORT_MSG(scopeMsg: IPortMsgScopeMsg) {
      handleMsg(scopeMsg.msg)
    }
  }

  scope.addEventListener('message', (event: IMessageEvent) => {
    const scopeMsg: ScopeMsg = JSON.parse(event.data)

    if (scopeMsgHandlers[scopeMsg.type]) {
      ;(scopeMsgHandlers as any)[scopeMsg.type](scopeMsg)
    }
  })
}
