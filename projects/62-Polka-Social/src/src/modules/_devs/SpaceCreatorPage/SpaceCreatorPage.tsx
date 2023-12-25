import Button from '#/components/Button'
import Card from '#/components/Card'
import ImageCircleInput from '#/components/inputs/ImageCircleInput'
import TextField from '#/components/inputs/TextField'
import TransactionModal from '#/containers/TransactionModal'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useResetForm } from '#/lib/hooks/useResetForm'
import { useCreateSpace } from '#/services/subsocial/mutations'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { createSpaceForm } from './form/schema'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export default function SpaceCreatorPage() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const {
    getFieldData,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormikWrapper({
    ...createSpaceForm,
    onSubmit: (values) => {
      console.log('CREATING SPACE...')
      setIsOpenModal(true)
      createSpace(values)
    },
  })

  const storagePrefix = 'create-space'
  const { key, resetFormData } = useResetForm({
    resetForm,
    storagePrefix,
    ...getFieldData('desc'),
  })
  const {
    mutate: createSpace,
    isLoading,
    data,
    error,
  } = useCreateSpace({
    onSuccess: resetFormData,
  })

  return (
    <div className={clsx('flex flex-col', 'w-full max-w-lg', 'mx-auto')}>
      <TransactionModal
        isLoading={isLoading}
        errorMsg={error?.message ?? ''}
        action='Creating Subsocial Space'
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
        hash={data?.toString()}
      />
      <h1 className={clsx('text-2xl')}>Welcome Developer!</h1>
      <p className={clsx('pt-2')}>
        This page will help you create a <strong>space</strong> in subsocial
        easily!
      </p>
      <Card
        className={clsx(
          'bg-bg-100',
          'px-8 pt-8 pb-12 mt-8',
          'flex flex-col items-center'
        )}
      >
        <p className='text-xl'>
          Let&apos;s create a <strong>space</strong>
        </p>
        <form
          className={clsx(
            'flex flex-col items-center',
            'space-y-4',
            'w-full',
            'mt-6'
          )}
          onSubmit={handleSubmit}
        >
          <ImageCircleInput
            {...getFieldData('avatar')}
            imageContainerClassName='mx-auto'
            value={undefined}
            onChange={(_, file) => {
              setFieldTouched('avatar')
              setFieldValue('avatar', file)
            }}
            helperText='Image should be less than 2MB'
          />
          <TextField {...getFieldData('name')} label='Name' />
          <RichTextArea
            {...getFieldData('desc')}
            key={key}
            storagePrefix='create-space'
            label='Description'
            saveContent
          />
          <Button className={clsx('!mt-8')} loading={isLoading} type='submit'>
            Create Space!
          </Button>
        </form>
      </Card>
    </div>
  )
}
