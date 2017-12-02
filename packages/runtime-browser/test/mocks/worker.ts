type Listener = (event: MessageEvent) => void

interface IListeners {
  [key: string]: Listener[]
}

type MessageHandler = (msg: any) => void

export function create(handleMsg: MessageHandler) {
  const listeners: IListeners = {}

  return {
    addEventListener(type: string, listener: Listener) {
      if (!listeners[type]) {
        listeners[type] = []
      }

      listeners[type].push(listener)
    },

    removeEventListener(type: string, listener: Listener) {
      if (listeners[type]) {
        const idx = listeners[type].indexOf(listener)

        if (idx > -1) {
          listeners[type].splice(idx)
        }
      }
    },

    dispatchEvent(event: any) {
      if (listeners[event.type]) {
        listeners[event.type].forEach(listener => listener(event as any))

        return true
      }

      return false
    },

    postMessage(msg: any) {
      handleMsg(msg)
    },

    onerror: (event: any) => {
      //
    },

    onmessage: (event: any) => {
      //
    },

    terminate: () => {
      //
    }
  }
}
