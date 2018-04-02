import {
  IHttpAbort,
  IHttpGet,
  IHttpRequest,
  IHttpResponse,
  IRequestMap
} from './types'

const requests: IRequestMap = {}

let i = 0

export interface IOpts {
  baseUrl?: string
  transport: any
}

export function create(opts: IOpts) {
  const baseUrl = opts.baseUrl || ''
  const { transport } = opts

  if (!transport) {
    throw new Error('Missing HTTP transport')
  }

  return {
    'http/ABORT': (
      cmd: IHttpAbort,
      handleMsg: () => void,
      handleCmd: () => void,
      done?: () => void
    ) => {
      if (requests[cmd.id]) {
        requests[cmd.id].unsubscribe()
        requests[cmd.id] = null
      }
      if (done) done()
    },

    'http/GET': (
      cmd: IHttpGet,
      handleMsg: (msg: IHttpRequest | IHttpResponse) => void,
      handleCmd: () => void,
      done?: () => void
    ) => {
      const url = cmd.url
      const labels = cmd.opts.labels || {}
      const id = `request_${i++}`
      const reqMsg: IHttpRequest = { type: 'http/REQUEST', id, url, labels }

      handleMsg(reqMsg)

      requests[id] = transport.get(`${baseUrl}${url}`).subscribe({
        next(res: any) {
          let body
          try {
            body = JSON.parse(res.text)
          } catch (_) {
            //
          }

          handleMsg({
            type: 'http/RESPONSE',
            url,
            labels,
            errorMessage: null,
            body,
            payload: res
          })
        },

        error(err: any) {
          const res = err.response

          let body
          try {
            body = JSON.parse(res.text)
          } catch (_) {
            //
          }

          handleMsg({
            type: 'http/RESPONSE',
            url,
            labels,
            errorMessage: err.message,
            body,
            payload: err.response
          })
        },

        complete() {
          if (done) done()
        }
      })
    }
  }
}
