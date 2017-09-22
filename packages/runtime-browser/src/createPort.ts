import {IMsg} from '@transclusion/runtime-core'
import {IPort, Subscriber} from './types'

export function createPort(types: string[], handleSend: (msg: IMsg) => void): IPort {
  const subscribers: Subscriber[] = []

  return {
    next(msg: IMsg) {
      if (types.indexOf(msg.type) > -1) {
        subscribers.forEach(subscriber => subscriber(msg))
      }
    },
    send(msg: IMsg) {
      if (types.indexOf(msg.type) > -1) {
        handleSend(msg)
      }
    },
    subscribe(fn: Subscriber) {
      subscribers.push(fn)

      return {
        unsubscribe() {
          subscribers.splice(subscribers.indexOf(fn), 1)
        }
      }
    }
  }
}
