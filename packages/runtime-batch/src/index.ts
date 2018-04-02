import { IMsg } from '@transclusion/runtime-core'

export interface IBatch {
  type: 'BATCH'
  cmdMsgs: IMsg[]
}

export function batch(...cmdMsgs: IMsg[]): IBatch {
  return { type: 'BATCH', cmdMsgs }
}

export const handler = {
  BATCH(
    cmdMsg: IBatch,
    handleMsg: (msg: IMsg) => void,
    handleCmd: (cmdMsg: IMsg) => Promise<void> | void
  ): Promise<void> {
    return Promise.all(cmdMsg.cmdMsgs.map(handleCmd)).then(() => void 0)
  }
}
