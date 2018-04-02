import { IVElement } from '@transclusion/vdom'

declare global {
  namespace JSX {
    type Element = IVElement
    interface IntrinsicElements {
      div: any
    }
  }
}
