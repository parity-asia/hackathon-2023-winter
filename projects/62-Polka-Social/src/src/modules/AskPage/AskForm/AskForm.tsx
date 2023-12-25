import Button from '#/components/Button'
import Select from '#/components/inputs/Select'
import TextArea from '#/components/inputs/TextArea'
import TransactionModal from '#/containers/TransactionModal'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useResetForm } from '#/lib/hooks/useResetForm'
import { useCreatePost } from '#/services/subsocial/mutations'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { askQuestionForm } from './form/schema'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export default function AskForm() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { getFieldData, handleSubmit, resetForm } = useFormikWrapper({
    ...askQuestionForm,
    onSubmit: (values) => {
      console.log('CREATING QUESTION...')
      setIsOpenModal(true)
      const usedValues = {
        ...values,
        tags: values.tags.map(({ value }) => value.toLowerCase()),
      }
      postQuestion(usedValues)
    },
  })
  const storagePrefix = 'ask'
  const { key, resetFormData } = useResetForm({
    resetForm,
    storagePrefix,
    ...getFieldData('body'),
  })
  const {
    mutate: postQuestion,
    isLoading,
    error,
  } = useCreatePost({
    onSuccess: resetFormData,
  })

  return (
    <form onSubmit={handleSubmit} className={clsx('flex flex-col')}>
      <TransactionModal
        action='Posting your question'
        isLoading={isLoading}
        errorMsg={error?.message}
        handleClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
      <h1 className={clsx('text-3xl')}>Ask a Public Question</h1>
      <TextArea
        label='Title'
        rows={1}
        className={clsx('text-xl')}
        labelClassName={clsx('text-sm font-bold')}
        containerClassName={clsx('space-y-1', 'mt-8')}
        helperText='Be specific and imagine you’re asking a question to another person'
        helperTextClassName={clsx('text-xs')}
        {...getFieldData('title')}
      />
      <RichTextArea
        key={key}
        label='Body'
        labelClassName={clsx('font-bold')}
        containerClassName={clsx('mt-8 text-sm')}
        helperText='Include all the information someone would need to answer your question'
        helperTextClassName={clsx('text-xs')}
        storagePrefix='ask'
        saveContent
        {...getFieldData('body')}
      />
      <Select
        creatable
        containerClassName={clsx('mt-8 text-sm')}
        labelClassName={clsx('font-bold')}
        isMulti
        label='Tags'
        helperText='Choose at least one tag'
        helperTextClassName={clsx('text-xs')}
        {...getFieldData('tags')}
      />
      <div className={clsx('mt-8 space-x-4', 'flex items-center')}>
        <Button type='submit'>Post your question</Button>
        <Button onClick={resetFormData} type='button' variant='outlined-red'>
          Discard draft
        </Button>
      </div>
    </form>
  )
}
