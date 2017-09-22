import {IMsg, IPortDefinitions} from '@transclusion/runtime-core'
import {Patch, VNode} from '@transclusion/vdom'

export interface IMessageEvent {
  type: 'message'
  data: any
}

export interface IWorker {
  addEventListener: (type: 'message', callback: (evt: MessageEvent) => void) => void
  postMessage: (msg: any) => void
}

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
  worker: IWorker
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
