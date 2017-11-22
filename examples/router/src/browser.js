import {run} from '@transclusion/runtime-browser'
import {toVNode} from '@transclusion/vdom'
import './root.css'
import Worker from './worker.js'

const rootElm = document.getElementById('root')

run(
  {
    element: rootElm.firstChild,
    props: __INITIAL_PROPS__,
    worker: new Worker()
  },
  ({ports}) => {
    ports.history.subscribe(msg => {
      switch (msg.type) {
        case 'history/PUSH_STATE':
          history.pushState(msg.state, msg.title, msg.path)
          break
        case 'history/REPLACE_STATE':
          history.replaceState(msg.state, msg.title, msg.path)
          break
      }
    })

    window.addEventListener('popstate', event => {
      ports.history.send({
        type: 'history/POP_STATE',
        path: location.pathname,
        state: event.state,
        title: document.title
      })
    })
  }
)
