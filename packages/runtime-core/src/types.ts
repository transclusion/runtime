import {VNode} from '@transclusion/vdom'

export interface IMsg {
  type: string
  [key: string]: any
}

export type Handler = (
  cmd: IMsg,
  handleMsg: (msg: IMsg) => void,
  handleCmd: (cmdMsg: IMsg) => Promise<void> | void
) => Promise<void>

export interface IHandlerSet {
  [key: string]: Handler
}

export interface IPortDefinitions {
  [key: string]: string[]
}

export interface IProgram<Props, Model> {
  init: (props?: Props) => [Model, IMsg | null]
  ports?: IPortDefinitions
  view: (model: Model) => VNode | null
  update: (model: Model, msg: IMsg) => [Model, IMsg | null]
}
