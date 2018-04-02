import { IBatch } from '@transclusion/runtime-batch'
import { IMsg, IProgram } from '@transclusion/runtime-core'

export type TransitionFn = (transition: any, done: () => void) => void

export interface ITransitionMap {
  [key: string]: TransitionFn
}

export interface IRoute {
  params: any
  value: string
}

export interface IRouteMap {
  [key: string]: string
}

export interface IProps {
  path: string
  routes: IRouteMap
  screen?: any
  screens: {
    [key: string]: IProgram<any, any>
  }
}

export interface IModel {
  nextPath: string | null
  nextRoute: IRoute | null
  nextScreen: any | null
  path: string
  route: IRoute | null
  routes: IRouteMap
  screen: any
  screens: {
    [key: string]: IProgram<any, any>
  }
}

export interface IPushStateMsg {
  type: 'router/PUSH_STATE'
  path: string
  preventDefault?: boolean
  transition?: IMsg
}

export interface IPopStateMsg {
  type: 'router/POP_STATE'
  path: string
}

export interface ITransitionDone {
  type: 'router/TRANSITION_DONE'
  transition: IMsg
}

export type Msg = IPushStateMsg | IPopStateMsg | ITransitionDone

export interface IDispose {
  type: 'router/DISPOSE'
}

export type Cmd = IBatch | null
