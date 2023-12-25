import { RenderElementProps, RenderLeafProps } from 'slate-react'
import CodeBlockElement from './CodeBlockElement'
import DefaultElement from './DefaultElement'
import Leaf from './Leaf'

export function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'code-block':
      return <CodeBlockElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
}

export function renderLeaf(props: RenderLeafProps) {
  return <Leaf {...props} />
}
