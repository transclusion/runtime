import {IMsg, IProgram} from '@transclusion/runtime-core'
import {VNode} from '@transclusion/vdom'

export interface IMessageEvent {
  type: 'message'
  data: string
}

export type Listener = (event: IMessageEvent) => void

export interface IScope {
  addEventListener: (type: 'message', callback: Listener) => void
  postMessage: (msg: any) => void
}

export type Handler = (cmdMsg: IMsg, handleMsg: (msg: IMsg) => void, handleCmd: (cmdMsg: IMsg) => void) => void

export interface IHandlerSet {
  [key: string]: Handler
}

export interface IOpts<Props, Model> {
  handlers?: IHandlerSet[]
  program: IProgram<Props, Model>
  scope: IScope
}

export interface IMountScopeMsg {
  type: 'MOUNT'
  vNode: VNode
  props: any
}

export interface IMsgScopeMsg {
  type: 'MSG'
  msg: IMsg
}

export interface IPortMsgScopeMsg {
  type: 'PORT_MSG'
  msg: IMsg
}

export type ScopeMsg = IMountScopeMsg | IMsgScopeMsg
