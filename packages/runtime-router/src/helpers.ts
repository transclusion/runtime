import * as pathToRegexpProxy from 'path-to-regexp'
import { IRoute, IRouteMap } from './types'

const pathToRegexp = (pathToRegexpProxy as any).default || pathToRegexpProxy

export function matchRoute(pathname: string, routes: IRouteMap): IRoute | null {
  let match = null

  Object.keys(routes).some(pattern => {
    const keys: any[] = []
    const re = pathToRegexp(pattern, keys)
    const result = re.exec(pathname)

    if (result) {
      match = { value: routes[pattern], params: {} }
      match.params = keys.reduce((params, key, idx) => {
        params[key.name] = result[idx + 1]
        return params
      }, match.params)
      return true
    }

    return false
  })

  return match
}
