export interface IMeta {
  [key: string]: any
}

export interface IMetaSet {
  type: 'meta/SET'
  meta: IMeta
}

export type Cmd = IMetaSet
