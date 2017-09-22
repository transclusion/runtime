import {IHandlerSet, IProgram} from '@transclusion/runtime-core'

export interface IOpts<Props, Model> {
  handlers?: IHandlerSet[]
  program: IProgram<Props, Model>
  props?: Props
}
