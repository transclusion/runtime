/** @jsx el */

import {createVElement as el} from '@transclusion/vdom'

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
      return [model, null]
  }
}

function navView() {
  return (
    <div>
      <a href="/" on={{click: {type: 'history/PUSH_STATE', path: '/', preventDefault: true}}}>
        Home
      </a>{' '}
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
