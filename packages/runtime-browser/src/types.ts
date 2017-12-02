import {IMsg, IPortDefinitions} from '@transclusion/runtime-core'
import {Patch, VNode} from '@transclusion/vdom'

export interface ISubscription {
  unsubscribe: () => void
}

export type Subscriber = (value: IMsg) => void

export interface IPort {
  next: (msg: IMsg) => void
  send: (msg: IMsg) => void
  subscribe: (fn: Subscriber) => ISubscription
}

export interface IPorts {
  [key: string]: IPort
}

export interface IContext {
  ports: IPorts
}

export interface IOpts<Props> {
  element: HTMLElement
  props: Props
  worker: Worker
}

export interface IInitWorkerMsg {
  type: 'INIT'
  patches: Patch[]
  ports: IPortDefinitions
  vNode: VNode
}

export interface IPatchWorkerMsg {
  type: 'PATCH'
  patches: Patch[]
}

export interface IPortMsgWorkerMsg {
  type: 'PORT_MSG'
  msg: any
}

export type WorkerMsg = IInitWorkerMsg | IPatchWorkerMsg | IPortMsgWorkerMsg
