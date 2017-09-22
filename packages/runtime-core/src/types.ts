import {VNode} from '@transclusion/vdom'

export interface IMsg {
  type: string
  [key: string]: any
}

export type Handler = (
  cmdMsg: IMsg,
  handleMsg: (msg: IMsg) => void,
  handleCmd: (cmdMsg: IMsg) => void,
  done?: () => void
) => void

export interface IHandlerSet {
  [key: string]: Handler
}

export interface IPortDefinitions {
  [key: string]: string[]
}

export interface IProgram<Props, Model> {
  init: (props?: Props) => [Model, IMsg | null]
  ports?: IPortDefinitions
  view: (model: Model) => VNode
  update: (model: Model, msg: IMsg) => [Model, IMsg | null]
}
