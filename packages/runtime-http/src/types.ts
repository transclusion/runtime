export type StatusCode = number

export interface IResponseUnset {
  readyState: 0
}

export interface IResponseOpened {
  readyState: 1
}

export interface IResponseHeadersReceived {
  readyState: 2
  headers: Headers
  status: StatusCode
}

export interface IResponseLoading {
  readyState: 3
  headers: Headers
  status: StatusCode
  bytesLoaded: number
  bytesTotal: number
}

export interface IResponseDone {
  readyState: 4
  headers: Headers
  status: StatusCode
  text: string
  bytesLoaded: number
  bytesTotal: number
}

export type Response =
  | IResponseUnset
  | IResponseOpened
  | IResponseHeadersReceived
  | IResponseLoading
  | IResponseDone

export interface IHttpAbort {
  type: 'http/ABORT'
  id: string
}

export interface IHttpOpts {
  labels?: { [key: string]: any }
}

export interface IHttpGet {
  type: 'http/GET'
  url: string
  opts: IHttpOpts
}

export interface IHttpRequest {
  type: 'http/REQUEST'
  id: string
  url: string
  labels?: { [key: string]: string }
}

export interface IHttpResponse {
  type: 'http/RESPONSE'
  // readyState: 0 | 1 | 2 | 3 | 4,
  // status: number,
  // headers: {[key: string]: string},
  url: string
  labels?: { [key: string]: string }
  // text: string,
  body: any
  errorMessage: string | null
  payload: Response
}

export interface IRequestMap {
  [id: string]: any
}
