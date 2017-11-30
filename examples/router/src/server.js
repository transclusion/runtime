import {run} from '@transclusion/runtime-server'
import express from 'express'
import * as root from './root'

export function create({manifest}) {
  const app = express()

  app.get('/*', async (req, res) => {
    try {
      const {html, model} = await run({
        program: root,
        props: {path: req.path}
      })

      res.send(`<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/${manifest['browser.css']}">
</head>
<body>
  <div id="root">${html}</div>
  <script>
  var __INITIAL_PROPS__ = ${JSON.stringify(model)};
  </script>
  <script src="/${manifest['browser.js']}"></script>
</body>
</html>`)
    } catch (err) {
      res.status(500)
      res.send(err.stack)
    }
  })

  return app
}
