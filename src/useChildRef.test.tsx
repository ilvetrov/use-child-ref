import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import useChildRef from './useChildRef'

describe('react hook useChildRef', () => {
  it('preserves DOM', () => {
    const ChildComponent = () => {
      return <h1>Header</h1>
    }

    const WrapComponent = (props: { children: JSX.Element }) => {
      const [child] = useChildRef(props.children)

      return child
    }

    render(
      <main>
        <WrapComponent>
          <ChildComponent></ChildComponent>
        </WrapComponent>
      </main>,
    )

    expect(screen.queryByRole('main')?.innerHTML).toBe('<h1>Header</h1>')
  })

  it('preserves ref in regular elements', () => {
    let childRefToTest: any
    let wrapRefToTest: any

    const WrapComponent = (props: { children: JSX.Element }) => {
      const [child, childRef] = useChildRef(props.children)

      wrapRefToTest = childRef

      return child
    }

    const MainComponent = () => {
      const ref = useRef<HTMLHeadingElement>(null)

      childRefToTest = ref

      return (
        <WrapComponent>
          <h1 ref={ref}>Header</h1>
        </WrapComponent>
      )
    }

    render(
      <main>
        <MainComponent></MainComponent>
      </main>,
    )

    expect(childRefToTest).toBe(wrapRefToTest)
    expect(wrapRefToTest.current.innerHTML).toBe('Header')
  })

  it('preserves ref in custom components', () => {
    let childRefToTest: any
    let wrapRefToTest: any

    const ChildComponent = forwardRef((_props, ref) => {
      return <h1 ref={ref as any}>Header</h1>
    })

    const WrapComponent = (props: { children: JSX.Element }) => {
      const [child, childRef] = useChildRef(props.children)

      wrapRefToTest = childRef

      return child
    }

    const MainComponent = () => {
      const ref = useRef<HTMLHeadingElement>(null)

      childRefToTest = ref

      return (
        <WrapComponent>
          <ChildComponent ref={ref}></ChildComponent>
        </WrapComponent>
      )
    }

    render(
      <main>
        <MainComponent></MainComponent>
      </main>,
    )

    expect(childRefToTest).toBe(wrapRefToTest)
    expect(wrapRefToTest.current.innerHTML).toBe('Header')
  })

  it('readme example: hide component', () => {
    function Hide(props: { children: JSX.Element; hide: boolean }) {
      const [child, childRef] = useChildRef<HTMLElement>(props.children)

      useLayoutEffect(() => {
        if (childRef?.current) {
          childRef.current.style.display = props.hide ? 'none' : ''
        }
      }, [props.hide])

      return child
    }

    render(
      <main>
        <Hide hide>
          <div></div>
        </Hide>
      </main>,
    )

    expect(screen.queryByRole('main')?.innerHTML).toBe('<div style="display: none;"></div>')
  })
})
