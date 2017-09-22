import {MessageEvent} from '../../src/types'

export function create(handleMsg) {
  const listeners = []

  return {
    addEventListener(type: 'message', callback: (event: MessageEvent) => void) {
      listeners.push(callback)
    },

    postMessage(msg) {
      handleMsg(msg)
    },

    send(data) {
      listeners.forEach(listener => listener({type: 'message', data: JSON.stringify(data)}))
    }
  }
}
