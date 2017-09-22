import {Listener} from '../../src/types'

export function create(postMessage: (data: any) => void) {
  const listeners: Listener[] = []
  return {
    addEventListener(type: string, callback: Listener) {
      listeners.push(callback)
    },
    postMessage,
    send(data: any) {
      listeners.forEach(listener => listener({type: 'message', data: JSON.stringify(data)}))
    }
  }
}
