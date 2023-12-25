import { RenderElementProps } from 'slate-react'

export default function DefaultElement(props: RenderElementProps) {
  return <p {...props.attributes}>{props.children}</p>
}
