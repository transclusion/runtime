import { batch } from '@transclusion/runtime-batch'
import { VNode } from '@transclusion/vdom'
import { matchRoute } from './helpers'
import { Cmd, IModel, IProps, Msg } from './types'

export { Cmd, IModel, IProps, Msg }

export const ports = {
  router: ['router/PUSH_STATE', 'router/POP_STATE', 'router/TRANSITION_DONE']
}

export function init(props: IProps): [IModel, Cmd] {
  const { path, routes, screens } = props
  const route = matchRoute(path, routes)
  const screen = route && screens[route.value]

  if (screen) {
    if (props.screen) {
      const [screenModel, screenCmd] = screen.init(props.screen)

      return [
        {
          nextPath: null,
          nextRoute: null,
          nextScreen: null,
          path,
          route,
          routes,
          screen: screenModel,
          screens
        },
        screenCmd as any
      ]
    } else {
      const [screenModel, screenCmd] = screen.init({
        params: route ? route.params : {}
      })

      return [
        {
          nextPath: null,
          nextRoute: null,
          nextScreen: null,
          path,
          route,
          routes,
          screen: screenModel,
          screens
        },
        screenCmd as any
      ]
    }
  }

  return [
    {
      nextPath: null,
      nextRoute: null,
      nextScreen: null,
      path,
      route,
      routes,
      screen: null,
      screens
    },
    null
  ]
}

export function mapModelToProps(model: IModel): IProps {
  if (
    !model.route ||
    !model.screens[model.route.value] ||
    !(model.screens[model.route.value] as any).mapModelToProps
  ) {
    return {
      path: model.path,
      routes: model.routes,
      screens: {}
    }
  }

  const screen: any = model.screens[model.route.value]

  return {
    path: model.path,
    routes: model.routes,
    screen: screen.mapModelToProps
      ? screen.mapModelToProps(model.screen)
      : null,
    screens: {}
  }
}

export function update(model: IModel, msg: Msg): [IModel, Cmd] {
  switch (msg.type) {
    case 'router/PUSH_STATE':
    case 'router/POP_STATE': {
      const { path } = msg
      const { screens } = model
      const transition =
        (msg.type === 'router/PUSH_STATE' && msg.transition) || null

      // curr
      const currScreen = model.route && screens[model.route.value]

      // next
      const route = matchRoute(path, model.routes)
      const nextScreen = route && screens[route.value]

      // has transition!!!
      if (transition) {
        if (route && currScreen && nextScreen) {
          const [nextScreenModel, nextScreenCmd] = nextScreen.init({
            params: route.params
          })

          return [
            {
              ...model,
              nextPath: path,
              nextRoute: route,
              nextScreen: nextScreenModel
            },
            nextScreenCmd as any
          ]
        }

        return [{ ...model, path, route }, null]
      }

      if (route && currScreen && nextScreen) {
        const [currScreenModel, currScreenCmd] = currScreen.update(
          model.screen,
          { type: 'router/DISPOSE' }
        )
        const currModel = {
          ...model,
          screen: currScreenModel
        }
        const [screenModel, screenCmd] = nextScreen.init({
          params: route.params
        })

        return [
          {
            ...currModel,
            path,
            route,
            screen: screenModel
          },
          (currScreenCmd && screenCmd
            ? batch(currScreenCmd, screenCmd)
            : currScreenCmd || screenCmd) as any
        ]
      } else if (route && nextScreen) {
        const [screenModel, screenCmd] = nextScreen.init({
          params: route.params
        })

        return [
          {
            ...model,
            path,
            route,
            screen: screenModel
          },
          screenCmd as any
        ]
      }

      return [
        {
          ...model,
          path,
          route
        },
        null
      ]
    }

    case 'router/TRANSITION_DONE': {
      const currScreen = model.route && model.screens[model.route.value]
      if (currScreen && model.nextPath && model.nextRoute && model.nextScreen) {
        const currResult = currScreen.update(model.screen, {
          type: 'router/DISPOSE'
        })
        return [
          {
            ...model,
            nextPath: null,
            nextRoute: null,
            nextScreen: null,
            path: model.nextPath,
            route: model.nextRoute,
            screen: model.nextScreen
          },
          currResult[1] as any
        ]
      }

      return [model, null]
    }

    default: {
      const { nextRoute, route, screens } = model

      if (nextRoute) {
        if (screens[nextRoute.value]) {
          const [nextScreenModel, nextScreenCmd] = screens[
            nextRoute.value
          ].update(model.nextScreen, msg)

          return [
            { ...model, nextScreen: nextScreenModel },
            nextScreenCmd as any
          ]
        }
      }

      if (route && screens[route.value]) {
        const [screenModel, screenCmd] = screens[route.value].update(
          model.screen,
          msg
        )

        return [{ ...model, screen: screenModel }, screenCmd as any]
      }

      return [model, null]
    }
  }
}

export function view(model: IModel): VNode | null {
  if (!model.route || !model.screens[model.route.value]) {
    return `Not found: ${model.path}`
  }

  const screen = model.screens[model.route.value]

  return screen.view(model.screen)
}
