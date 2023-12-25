import clsx from 'clsx'
import { CSSProperties } from 'react'
import { RenderLeafProps } from 'slate-react'

type LeafTypes = 'span' | 'code'

export default function Leaf(props: RenderLeafProps) {
  let Component: LeafTypes = 'span'
  let customStyle: CSSProperties = {}
  let customClassNames = ''
  if (props.leaf.code) {
    Component = 'code'
    customStyle = { fontSize: '85%' }
    customClassNames = clsx('bg-code', 'rounded-md', 'px-1.5 py-0.5')
  }
  return (
    <Component
      {...props.attributes}
      className={customClassNames}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : undefined,
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        ...customStyle,
      }}
    >
      {props.children}
    </Component>
  )
}
