# @transclusion/runtime

An isomorphic runtime for functional JavaScript programs.

## Features

* **Inspired by Elm**. Based on concepts similar to Elm’s – in good ol’ JavaScript – with server-side support.
* **Pure.** Write view components using pure functions. Handle side-effects in separate handler functions.
* **Typed**. Written in TypeScript.

## Philosophy

`runtime` separates application logic between the browser, worker and server.

| Scope                               | Responsibility                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Browser](packages/runtime-browser) | Responsible for updating the DOM and using other Web APIs such as Animation, History, Geolocation, and so on.                                                                              |
| [Worker](packages/runtime-worker)   | Responsible for keeping track of application state, virtual DOM and diffing. The worker also handles network requests.                                                                     |
| [Server](packages/runtime-server)   | Responsible for rendering the initial state of a program, given a set of input properties such as URL path, query parameters, cookies and so on. The server also handles network requests. |

## Motivation for using a worker thread

**Using a worker thread** for maintaining application state and diffing the virtual DOM, keeps heavy operations away
from the main UI thread. **The main UI thread** should mostly be idle, and sometimes perform DOM operations and interact
with other Web APIs.
