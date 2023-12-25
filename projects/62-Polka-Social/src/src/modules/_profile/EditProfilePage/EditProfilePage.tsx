import Button from '#/components/Button'
import Card from '#/components/Card'
import ImageCircleInput from '#/components/inputs/ImageCircleInput'
import TextField from '#/components/inputs/TextField'
import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import TransactionModal from '#/containers/TransactionModal'
import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { getImageUrlFromIPFS } from '#/lib/helpers/image-url-generator'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useResetForm } from '#/lib/hooks/useResetForm'
import { useUpdateProfile } from '#/services/subsocial/mutations'
import { useGetProfile } from '#/services/subsocial/queries'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { editProfileForm } from './form/schema'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

const isObjContentIdenticalToAnother = (
  obj1: Record<string, any>,
  obj2: Record<string, any> = {}
) => {
  return Object.keys(obj1).every((key) => obj1[key] === (obj2[key] ?? ''))
}

export default function EditProfilePage() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const [wallet] = useWalletContext()
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetched,
  } = useGetProfile({ address: encodeAddress(wallet?.address) })
  const { loadingChecker } = useIntegratedSkeleton(isLoadingProfile, isFetched)

  const [formError, setFormError] = useState('')
  const {
    getFieldData,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setValues,
    resetForm,
    values,
  } = useFormikWrapper({
    ...editProfileForm,
    onSubmit: (submittedValues) => {
      console.log('EDITING PROFILE...')
      if (isObjContentIdenticalToAnother(submittedValues, profile?.content)) {
        setFormError('No changes detected yet')
        return
      }
      setFormError('')
      setIsOpenModal(true)
      updateProfile({
        ...submittedValues,
        profileId: profile?.content ? profile?.id : undefined,
      })
    },
  })

  const reloadFormFromProfile = useCallback(() => {
    if (!profile) return
    setValues({
      name: profile.content?.name ?? '',
      about: profile.content?.about ?? '',
      avatar: profile.content?.image ?? '',
    })
  }, [profile, setValues])

  useEffect(() => {
    reloadFormFromProfile()
  }, [reloadFormFromProfile])

  const storagePrefix = 'edit-profile'
  const { key, resetFormData } = useResetForm({
    resetForm,
    storagePrefix,
    ...getFieldData('about'),
  })
  const {
    mutate: updateProfile,
    isLoading: isLoadingUpdate,
    data,
    error,
  } = useUpdateProfile({
    onSuccess: resetFormData,
  })

  const loadingProfileOrUpdating =
    isLoadingUpdate || loadingChecker(isLoadingProfile)

  return (
    <div className={clsx('flex flex-col', 'w-full max-w-lg', 'mx-auto')}>
      <TransactionModal
        isLoading={isLoadingUpdate}
        errorMsg={error?.message ?? ''}
        action='Updating Profile'
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
        hash={data?.toString()}
      />
      <p className='text-xl font-bold mb-1'>My Profile</p>
      <p className='text-text-secondary text-sm'>
        Let people know a little bit more about you!
      </p>
      <Card
        className={clsx('bg-bg-100', 'px-6 pt-8 pb-8 mt-6', 'flex flex-col')}
      >
        <form
          className={clsx('flex flex-col', 'space-y-4', 'w-full')}
          onSubmit={handleSubmit}
        >
          <ImageCircleInput
            {...getFieldData('avatar')}
            image={
              typeof values.avatar === 'string'
                ? getImageUrlFromIPFS(values.avatar)
                : values.avatar
            }
            value={undefined}
            onChange={(_, file) => {
              setFieldTouched('avatar')
              setFieldValue('avatar', file)
            }}
            disabled={loadingProfileOrUpdating}
            helperText='Image should be less than 2MB'
            helperTextClassName={clsx('text-xs')}
          />
          <TextField
            {...getFieldData('name')}
            label='Name'
            disabled={loadingProfileOrUpdating}
          />
          <RichTextArea
            {...getFieldData('about')}
            className={clsx('!min-h-[6em]')}
            key={key}
            storagePrefix='create-space'
            label='About'
            disabled={loadingProfileOrUpdating}
          />
          <p className='!mt-6'>
            {formError && (
              <span className={clsx('text-red-400 text-sm font-bold')}>
                {formError}
              </span>
            )}
          </p>
          <div className={clsx('!mt-4', 'flex items-center', 'space-x-4')}>
            <Button
              loading={isLoadingUpdate}
              type='submit'
              disabled={loadingProfileOrUpdating}
            >
              Update Profile
            </Button>
            <Button
              disabled={loadingProfileOrUpdating}
              onClick={reloadFormFromProfile}
              type='button'
              loading={isLoadingUpdate}
              variant='outlined-red'
            >
              Discard Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
