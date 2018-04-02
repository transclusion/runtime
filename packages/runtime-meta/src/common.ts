import { IMeta, IMetaSet } from './types'

export function set(meta: IMeta): IMetaSet {
  return { type: 'meta/SET', meta }
}

export const ports = {
  meta: ['meta/SET']
}
