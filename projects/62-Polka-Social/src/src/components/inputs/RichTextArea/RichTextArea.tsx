import { EditorType } from '#/declarations/slate'
import { onChangeWrapper } from '#/lib/helpers/form'
import useRerender from '#/lib/hooks/useRerender'
import clsx from 'clsx'
import { useEffect, useMemo, useRef } from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from '../common/FieldWrapper'
import { renderElement, renderLeaf } from './elements'
import { deserializeDraft, serializeDraft } from './helpers/serializer'
import { transformOnKeyDown } from './helpers/transformer'

export interface TextAreaStorageProps {
  name: string
  storagePrefix?: string
}

type ParentProps = EditableProps &
  RequiredFieldWrapperProps &
  TextAreaStorageProps

export interface RichTextAreaProps extends ParentProps {
  startOneLine?: boolean
  asReadOnlyContent?: {
    content?: string
  }
  saveContent?: boolean
}

const getNodeFromString = (text: string): Descendant => ({
  type: 'paragraph',
  children: [{ text }],
})

const defaultInitialValue: Descendant[] = [getNodeFromString('')]

export function useTextAreaStorage({
  name,
  storagePrefix: _storagePrefix,
}: TextAreaStorageProps) {
  const storagePrefix = _storagePrefix ? `-${_storagePrefix}` : ''
  const storageKey = `textarea${storagePrefix}-${name}`

  return useMemo(() => {
    const savedDraft =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(storageKey) ?? ''
        : ''
    const setDraft = (draft: string) =>
      window.localStorage.setItem(storageKey, draft)
    const clearDraft = () => window.localStorage.removeItem(storageKey)
    return [savedDraft, setDraft, clearDraft] as const
  }, [storageKey])
}

export default function RichTextArea({
  startOneLine,
  storagePrefix,
  onChange,
  asReadOnlyContent,
  saveContent = false,
  ...props
}: RichTextAreaProps) {
  const editorRef = useRef<EditorType | null>(null)
  if (!editorRef.current)
    editorRef.current = withHistory(withReact(createEditor()))
  const editor = editorRef.current
  const rerender = useRerender()

  const localValueRef = useRef('')
  useEffect(() => {
    if (asReadOnlyContent) return
    const value = props.value as string
    if (value !== localValueRef.current && editorRef.current) {
      editorRef.current.children = value ? deserializeDraft(value) : ''
      rerender()
    }
  }, [props.value, editor, rerender, asReadOnlyContent])

  const [savedDraft, setDraft] = useTextAreaStorage({
    name: props.name,
    storagePrefix,
  })
  useEffect(() => {
    if (savedDraft && saveContent) {
      onChangeWrapper(onChange, savedDraft, props.name)
      editor.children = deserializeDraft(savedDraft)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedDraft, saveContent])

  const parsedDefaultValue = useMemo(() => {
    try {
      return deserializeDraft(asReadOnlyContent?.content ?? '')
    } catch (e) {
      return [getNodeFromString(asReadOnlyContent?.content ?? '')]
    }
  }, [asReadOnlyContent?.content])

  const cleanedProps = getCleanedInputProps(props)

  return (
    <FieldWrapper {...props}>
      {(id, classNames) => (
        <Slate
          editor={editor}
          value={asReadOnlyContent ? parsedDefaultValue : defaultInitialValue}
          key={asReadOnlyContent ? parsedDefaultValue : undefined}
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => 'set_selection' !== op.type
            )
            if (isAstChange) {
              const content = serializeDraft(value)
              if (saveContent) {
                setDraft(content)
              }
              localValueRef.current = content
              // TODO: because this is still json stringify, the length will be more than the actual content
              onChangeWrapper(onChange, content, props.name)
            }
          }}
        >
          <Editable
            {...cleanedProps}
            readOnly={cleanedProps.disabled || !!asReadOnlyContent}
            className={clsx(
              !startOneLine && !asReadOnlyContent && 'min-h-[8em]',
              !asReadOnlyContent && classNames,
              props.disabled &&
                '!brightness-75 !cursor-not-allowed !ring-0 !ring-offset-0',
              props.className
            )}
            id={id}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={(e) => transformOnKeyDown(e, editor)}
          />
        </Slate>
      )}
    </FieldWrapper>
  )
}
