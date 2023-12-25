import clsx from 'clsx'
import { RenderElementProps } from 'slate-react'

export default function CodeBlockElement(props: RenderElementProps) {
  return (
    <pre {...props.attributes} className={clsx('px-4 py-1.5', 'bg-code')}>
      {props.children}
    </pre>
  )
}
