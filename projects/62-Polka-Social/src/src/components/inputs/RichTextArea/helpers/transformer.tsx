import { CustomElement, CustomText, EditorType } from '#/declarations/slate'
import { KeyboardEvent } from 'react'
import { Editor, Element, Text, Transforms } from 'slate'

function matchTextProps(
  editor: EditorType,
  checker: (n: CustomText) => boolean
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Text.isText(n) && checker(n),
    universal: true,
  })
  return match
}

function toggleTextMark(
  editor: EditorType,
  checkActive: (editor: EditorType) => boolean,
  editedProps: (isActive: boolean) => Partial<CustomText>
) {
  const isActive = checkActive(editor)
  Transforms.setNodes(editor, editedProps(isActive), {
    match: (n) => Text.isText(n),
    split: true,
  })
}

function matchTextBlock(
  editor: EditorType,
  checker: (n: CustomElement) => boolean
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && checker(n),
    universal: true,
  })
  return match
}

function toggleTextBlock(
  editor: EditorType,
  checkActive: (editor: EditorType) => boolean,
  editedProps: (isActive: boolean) => CustomElement['type'],
  options?: Parameters<typeof Transforms['setNodes']>[2]
) {
  const isActive = checkActive(editor)
  Transforms.setNodes(
    editor,
    { type: editedProps(isActive) },
    {
      match: (n) => Element.isElement(n),
      ...options,
    }
  )
}

export const CustomEditor = {
  // Text Mark
  isBoldMarkActive: (editor: EditorType) =>
    !!matchTextProps(editor, (n) => n.bold === true),
  isCodeMarkActive: (editor: EditorType) =>
    !!matchTextProps(editor, (n) => n.code === true),
  isItalicMarkActive: (editor: EditorType) =>
    !!matchTextProps(editor, (n) => n.italic === true),
  isUnderlineMarkActive: (editor: EditorType) =>
    !!matchTextProps(editor, (n) => n.underline === true),

  toggleBoldMark: (editor: EditorType) => {
    toggleTextMark(editor, CustomEditor.isBoldMarkActive, (isActive) => ({
      bold: !isActive,
    }))
  },
  toggleCodeMark: (editor: EditorType) => {
    toggleTextMark(editor, CustomEditor.isCodeMarkActive, (isActive) => ({
      code: !isActive,
    }))
  },
  toggleItalicMark: (editor: EditorType) => {
    toggleTextMark(editor, CustomEditor.isItalicMarkActive, (isActive) => ({
      italic: !isActive,
    }))
  },
  toggleUnderlineMark: (editor: EditorType) => {
    toggleTextMark(editor, CustomEditor.isUnderlineMarkActive, (isActive) => ({
      underline: !isActive,
    }))
  },

  // Text Block
  isCodeBlockActive: (editor: EditorType) =>
    !!matchTextBlock(editor, (n) => n.type === 'code-block'),

  toggleCodeBlock: (editor: EditorType) =>
    toggleTextBlock(editor, CustomEditor.isCodeBlockActive, (isActive) =>
      isActive ? 'paragraph' : 'code-block'
    ),
}

export function transformOnKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  editor: EditorType
) {
  const activateCtrlKeyBind = keyBindCtrl(event, editor)
  const activateShiftKeyBind = keyBindShift(event, editor)
  if (activateCtrlKeyBind || activateShiftKeyBind) event.preventDefault()
}

function keyBindCtrl(event: KeyboardEvent<HTMLDivElement>, editor: EditorType) {
  if (!event.ctrlKey) return false
  switch (event.key) {
    case '`':
      CustomEditor.toggleCodeMark(editor)
      break
    case 'k':
      CustomEditor.toggleCodeBlock(editor)
      break
    case 'b':
      CustomEditor.toggleBoldMark(editor)
      break
    case 'i':
      CustomEditor.toggleItalicMark(editor)
      break
    case 'u':
      CustomEditor.toggleUnderlineMark(editor)
      break
    default:
      return false
  }
  return true
}

function keyBindShift(
  event: KeyboardEvent<HTMLDivElement>,
  editor: EditorType
) {
  if (!event.shiftKey) return false
  switch (event.key) {
    default:
      return false
  }
  return true
}
