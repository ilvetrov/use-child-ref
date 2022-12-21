import React, { Children, MutableRefObject, useRef } from 'react'

export default function useChildRef<T = HTMLElement>(
  children: JSX.Element,
): [JSX.Element, MutableRefObject<T | null | undefined> | undefined] {
  const child: {
    key: any
    props: any
    ref: null | MutableRefObject<T | null | undefined>
    type: any
  } = Children.only(children) as any

  const innerChildRef = useRef<T>()

  const canSetRef = typeof child.type === 'string' || child.type.$$typeof === Symbol.for('react.forward_ref')

  const childRef = canSetRef ? child.ref ?? innerChildRef : undefined

  return [
    <child.type {...child.props} ref={childRef}>
      {child.props.children}
    </child.type>,
    childRef,
  ]
}
