import { IMsg } from '@transclusion/runtime-core'
import { ports, set } from './common'
import { IMeta, IMetaSet } from './types'

export { ports, set }

export { IMeta, IMetaSet }

export function createHandler(defaultMeta: IMeta) {
  return {
    'meta/SET'(
      cmd: IMetaSet,
      handleMsg: (msg: IMsg) => void,
      handleCmd: (cmd: IMsg) => void
    ) {
      Object.keys(cmd.meta).forEach((key: string) => {
        if (typeof (defaultMeta as any)[key] === 'object') {
          ;(defaultMeta as any)[key] = {
            ...(defaultMeta as any)[key],
            ...(cmd as any).meta[key]
          }
        } else {
          ;(defaultMeta as any)[key] = (cmd as any).meta[key]
        }
      })
    }
  }
}

export function handlePorts(incomingPorts: any) {
  //
}
