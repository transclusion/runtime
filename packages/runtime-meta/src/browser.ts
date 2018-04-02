import { IPorts } from '@transclusion/runtime-browser'
import { IMsg } from '@transclusion/runtime-core'
import { ports, set } from './common'
import { Cmd, IMetaSet } from './types'

export { ports, set }

export { IMetaSet }

export function handlePorts(incomingPorts: IPorts) {
  if (!incomingPorts.meta) {
    throw new Error('Missing `meta` port')
  }

  incomingPorts.meta.subscribe((cmd: Cmd) => {
    switch (cmd.type) {
      case 'meta/SET':
        if (cmd.meta.title) {
          document.title = cmd.meta.title
        }
        break
    }
  })
}

export function createHandler() {
  return {
    'meta/SET'(
      cmd: IMetaSet,
      handleMsg: (msg: IMsg) => void,
      handleCmd: (cmd: IMsg) => void
    ) {
      handleMsg(cmd)
    }
  }
}
