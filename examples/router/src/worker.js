import {run} from '@transclusion/runtime-worker'
import * as root from './root'

run({
  program: root,
  scope: self
})
