import {
  TextAreaStorageProps,
  useTextAreaStorage,
} from '#/components/inputs/RichTextArea/RichTextArea'
import useCounter from './useCounter'

export function useResetForm({
  resetForm,
  ...textAreaStorageProps
}: { resetForm: () => void } & TextAreaStorageProps) {
  const [counter, countUp] = useCounter()

  const [, , clearDraft] = useTextAreaStorage(textAreaStorageProps)

  const resetFormData = () => {
    clearDraft()
    resetForm()
    countUp()
  }

  return {
    resetFormData,
    key: counter,
  }
}
