# @transclusion/runtime

An isomorphic runtime for functional JavaScript programs.

## Features

* **Inspired by Elm**. Based on concepts similar to Elm’s – in good ol’ JavaScript – with server-side support.
* **Pure.** Write view components using pure functions. Handle side-effects in separate handler functions.
* **Typed**. Written in TypeScript.

## Documentation

### Philosophy

`runtime` separates application logic between the browser, worker and server.

| Scope                               | Responsibility                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Browser](packages/runtime-browser) | Responsible for updating the DOM and using other Web APIs such as Animation, History, Geolocation, and so on.                                                                              |
| [Worker](packages/runtime-worker)   | Responsible for keeping track of application state, virtual DOM and diffing. The worker also handles network requests.                                                                     |
| [Server](packages/runtime-server)   | Responsible for rendering the initial state of a program, given a set of input properties such as URL path, query parameters, cookies and so on. The server also handles network requests. |

### Motivation for using a worker thread

**Using a worker thread** for maintaining application state and diffing the virtual DOM, keeps heavy operations away
from the main UI thread. **The main UI thread** should mostly be idle, and sometimes perform DOM operations and interact
with other Web APIs.

## Getting started

First install the dependencies:

```sh
npm install @transclusion/vdom -S
npm install @transclusion/runtime-core -S
npm install @transclusion/runtime-browser -S
npm install @transclusion/runtime-server -S
npm install @transclusion/runtime-worker -S
```

### Create a program called `root.js`

Components in `runtime` are called _programs_ (like in Elm).

```jsx
/** @jsx createVElement */

import {createVElement} from '@transclusion/vdom'

// Expose message/command types that will be sent to the browser
export const ports = {
  history: ['history/POP_STATE', 'history/PUSH_STATE', 'history/REPLACE_STATE']
}

// Initialize the program’s model value
export function init(props) {
  return [{path: props.path, state: props.state, title: props.title}, null]
}

// Update the program’s model value (after which the view is re-rendered)
export function update(model, msg) {
  switch (msg.type) {
    case 'history/POP_STATE':
    case 'history/PUSH_STATE':
    case 'history/REPLACE_STATE':
      return [{...model, path: msg.path, state: msg.state, title: msg.title}, null]
    default:
      return [model, msg]
  }
}

function navView() {
  return (
    <div>
      <a href="/" on={{click: {type: 'history/PUSH_STATE', path: '/', preventDefault: true}}}>
        Home
      </a>
      <a href="/blog" on={{click: {type: 'history/PUSH_STATE', path: '/blog', preventDefault: true}}}>
        Blog
      </a>
    </div>
  )
}

// Render the view as virtual DOM
export function view(model) {
  switch (model.path) {
    case '/':
      return (
        <div>
          {navView()}
          <h1>Home screen</h1>
        </div>
      )
    case '/blog':
      return (
        <div>
          {navView()}
          <h1>Blog screen</h1>
        </div>
      )
    default:
      return (
        <div>
          {navView()}
          <h1>Not found: {model.path}</h1>
        </div>
      )
  }
}
```

### In the browser

```js
import {run} from '@transclusion/runtime-browser'

run(
  {
    element: document.getElementById('root'),
    props: __INITIAL_PROPS__,
    worker: new Worker('worker.js')
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
```

### In the worker

```js
import {run} from '@transclusion/runtime-worker'
import * as root from './root'

run({
  program: root,
  scope: this
})
```

### On the server

```js
import {run} from '@transclusion/runtime-server'
import express from 'express'
import * as root from './root'

const app = express()

app.get('/*', (req, res) => {
  run({
    program: root,
    props: {path: req.path}
  }).then(context => {
    res.send(`<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <div id="root">${context.html}</div>
    <script>
    var __INITIAL_PROPS__ = ${JSON.stringify(context.model)}
    </script>
    <script src="browser.js"></script>
  </body>
  </html>`)
    )
  }).catch(err => {
    res.status(500)
    res.send(err.stack)
  })
})

app.listen(3000)
```
