import { create as createHandler } from './handler'

import {
  IHttpAbort,
  IHttpGet,
  IHttpOpts,
  IHttpRequest,
  IHttpResponse
} from './types'

export { IHttpGet, IHttpRequest, IHttpResponse }

export const abort = (id: string): IHttpAbort => {
  return { type: 'http/ABORT', id }
}

export const get = (url: string = '', opts: IHttpOpts = {}): IHttpGet => {
  return { type: 'http/GET', url, opts }
}

export { createHandler }
