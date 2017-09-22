# @transclusion/runtime-worker

## Usage

```jsx
/** @jsx createVElement */

import {run} from '@transclusion/runtime-worker'
import {createVElement} from '@transclusion/vdom'

const counter = {
  init() {
    return [0, null]
  },
  update(model, msg) {
    switch (msg) {
      case 'DECR':
        return [model - 1, null]
      case 'INCR':
        return [model - 1, null]
      default:
        return [model, null]
    }
  },
  view(model) {
    return (
      <div class="counter">
        <button innerHTML="-" on={{click: 'DECR'}} />
        {model}
        <button innerHTML="+" on={{click: 'INCR'}} />
      </div>
    )
  }
}

run({
  program: counter,
  scope: self
})
```
