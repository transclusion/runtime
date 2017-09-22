# @transclusion/runtime-browser

## Usage

```js
import {run} from '@transclusion/runtime-browser'

run(
  {
    element: document.getElementById('root'),
    props: {},
    worker: new Worker('worker.js')
  },
  context => {
    context.ports.history.subscribe(msg => {
      switch (msg.type) {
        case 'PUSH_STATE':
          history.pushState(msg.state, msg.title, msg.path)
          break

        case 'REPLACE_STATE':
          history.replaceState(msg.state, msg.title, msg.path)
          break
      }
    })

    window.addEventListener('popstate', event => {
      context.ports.history.send({
        type: 'POP_STATE',
        state: event.state,
        path: location.pathname
      })
    })
  }
)
```
