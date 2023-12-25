import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

type EditorType = BaseEditor & ReactEditor & HistoryEditor
type ElementTypes = 'paragraph' | 'code-block'
type CustomElement = { type: ElementTypes; children: CustomText[] }
type CustomText = {
  text: string
  bold?: boolean
  underline?: boolean
  italic?: boolean
  code?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
    EditorType: EditorType
  }
}
