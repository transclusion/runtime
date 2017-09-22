import {IMsg} from '@transclusion/runtime-core'
import {toHTML, VNode} from '@transclusion/vdom'
import {IOpts} from './types'

export function run<Props, Model>(opts: IOpts<Props, Model>) {
  const {handlers, program, props} = opts
  const msgQueue: IMsg[] = []

  function handleCmd(cmdMsg: IMsg) {
    return new Promise((resolve, reject) => {
      const handler = handlers ? handlers.find(h => h.hasOwnProperty(cmdMsg.type)) : null

      if (handler) {
        handler[cmdMsg.type](cmdMsg, (msg: any) => msgQueue.push(msg), handleCmd, resolve)
      } else {
        reject(
          new Error(`Unknown command type: ${cmdMsg.type}
Did you remember to add a command handler for this command type?`)
        )
      }
    })
  }

  function handleMsgQueue(): Promise<void> {
    const msg = msgQueue.shift()

    if (msg) {
      ;[model, cmd] = program.update(model, msg)
      vNode = program.view(model)

      if (cmd) {
        return handleCmd(cmd).then(() => handleMsgQueue())
      }

      return handleMsgQueue()
    }

    return Promise.resolve()
  }

  let model: Model
  let cmd: IMsg | null
  let vNode: VNode
  ;[model, cmd] = program.init(props)
  vNode = program.view(model)

  if (cmd) {
    return handleCmd(cmd)
      .then(() => handleMsgQueue())
      .then(() => ({html: toHTML(vNode), model}))
  } else {
    return Promise.resolve({html: toHTML(vNode), model})
  }
}
