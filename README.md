<p>
  <img src="https://raw.githubusercontent.com/ilvetrov/use-child-ref/main/logo.svg" width="150" height="75" />
</p>

# useChildRef

`useChildRef` is a React hook for getting or creating a child ref.

## Usage

- If `props.children` has a ref, childRef will be that ref.

- If `props.children` does not have a ref, childRef will be the newly created ref.

- If `props.children` cannot have a ref, childRef will be `undefined`. For example, any of your custom components without a [forwardRef](https://reactjs.org/docs/forwarding-refs.html) cannot have a ref.

```tsx
import useChildRef from 'use-child-ref'

export default function IAmUsingChildRef(props: { children: JSX.Element }) {
  const [child, childRef] = useChildRef(props.children)

  return child
}
```

### Rules

- You must return `child` from the hook, not `props.children`, for the new ref to work.
  ```tsx
  const [child, childRef] = useChildRef(props.children)
  
  return child
  ```
- `props.children` must be one element.
  ```tsx
  // Good
  export function ParentComponent() {
    return (
      <IAmUsingChildRef>
        <div></div>
      </IAmUsingChildRef>
    )
  }

  // Bad
  export function ParentComponent() {
    return (
      <IAmUsingChildRef>
        <div></div>
        <div></div>
      </IAmUsingChildRef>
    )
  }
  ```
- Use [forwardRef](https://reactjs.org/docs/forwarding-refs.html) with your custom component if you want to give access to an element in the component via ref.
  ```tsx
  import { forwardRef } from 'react'

  export const WithoutRefAccess = () => {
    return <h1></h1>
  }

  export const WithRefAccess = forwardRef((props, ref) => {
    return <h1 ref={ref}></h1>
  })

  export const IAmUsingChildRef = (props: { children: JSX.Element }) => {
    const [child, childRef] = useChildRef(props.children)

    console.log('childRef: ', typeof childRef)

    return child
  }

  export const ParentComponent = () => {
    return (
      <>
        <IAmUsingChildRef>
          {/* childRef: undefined */}
          <WithoutRefAccess></WithoutRefAccess>
        </IAmUsingChildRef>

        <IAmUsingChildRef>
          {/* childRef: object */}
          <WithRefAccess></WithRefAccess>
        </IAmUsingChildRef>
      </>
    )
  }
  ```

### Example: Hide Component

Sometimes it's so necessary for legacy third-party code :)

```tsx
import useChildRef from 'use-child-ref'

export default function Hide(props: { children: JSX.Element; hide: boolean }) {
  const [child, childRef] = useChildRef<HTMLElement>(props.children)

  useLayoutEffect(() => {
    if (childRef?.current) {
      childRef.current.style.display = props.hide ? 'none' : ''
    }
  }, [props.hide])

  return child
}
```
