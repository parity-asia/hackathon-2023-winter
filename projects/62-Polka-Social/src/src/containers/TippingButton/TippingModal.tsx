import Button from '#/components/Button'
import ImageContainer from '#/components/ImageContainer'
import Select from '#/components/inputs/Select'
import { OptionType } from '#/components/inputs/Select/Select'
import TextField from '#/components/inputs/TextField'
import Modal, { ModalProps } from '#/components/Modal'
import { useWalletContext } from '#/contexts/WalletContext'
import { chains, TokenTickers } from '#/lib/constants/chains'
import { formatBalance, parseBalance } from '#/lib/helpers/chain'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useTransfer } from '#/services/all-chains/mutations'
import { useGetTokenBalance } from '#/services/all-chains/queries'
import { SpaceData } from '@subsocial/api/types'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import { BsCash } from 'react-icons/bs'
import { tippingForm } from './form/schema'

export interface TippingModalProps extends ModalProps {
  dest: string
  profile: SpaceData | undefined
}

const options = Object.entries(chains).map<OptionType>(([token, { icon }]) => ({
  value: token,
  label: (
    <div className='flex items-center'>
      <div className='w-5 mr-2'>
        <ImageContainer className='rounded-full' aspectRatio='1:1' src={icon} />
      </div>
      <p>{token}</p>
    </div>
  ),
}))

export default function TippingModal({
  dest,
  profile,
  ...props
}: TippingModalProps) {
  const [wallet] = useWalletContext()
  const {
    getFieldData,
    values,
    handleSubmit,
    setFieldError,
    setFieldValue,
    setFieldTouched,
  } = useFormikWrapper({
    ...tippingForm,
    onSubmit: ({ amount, network }) => {
      const parsedAmount = parseBalance(amount)
      if (parsedAmount > balance) {
        setFieldError('amount', 'Your balance is not sufficient')
        return
      }
      tip({
        dest,
        network: network?.value as TokenTickers,
        value: parsedAmount,
      })
    },
  })
  const { data: balance, isLoading } = useGetTokenBalance({
    address: wallet?.address ?? '',
    network: values.network?.value as TokenTickers | undefined,
  })
  const { mutate: tip } = useTransfer({
    onSuccess: () => {
      setFieldValue('amount', 0)
      setFieldTouched('amount', false)
    },
  })

  const profileName = profile?.content?.name
  return (
    <Modal autoFocus={false} withCloseButton={false} size='sm' {...props}>
      <form onSubmit={handleSubmit} className={clsx('flex flex-col', 'p-4')}>
        <p className={clsx('text-center text-xl')}>
          How much do you want to tip <br />
          <strong>{profileName ?? truncateMiddle(dest)}</strong>
        </p>
        <p className={clsx('mt-2 text-center', 'text-text-secondary text-xs')}>
          {dest}
        </p>
        <div
          className={clsx('flex items-start', 'space-x-4', 'mt-8', 'text-sm')}
        >
          <Select
            labelClassName={clsx('text-xs')}
            helperTextClassName={clsx('text-xs')}
            containerClassName={clsx('w-56')}
            options={options}
            label='Token'
            tabIndex={0}
            {...getFieldData('network')}
          />
          <TextField
            labelClassName={clsx('text-xs')}
            helperTextOnRightOfLabelClassNames={clsx('text-xs')}
            helperTextClassName={clsx('text-xs')}
            type='number'
            {...getFieldData('amount')}
            label='Amount'
            helperTextOnRightOfLabel={
              isLoading
                ? 'Loading...'
                : `Balance: ${formatBalance(balance ?? 0)}`
            }
            rightElement={(classNames) => (
              <Button
                noClickEffect
                size='icon-small'
                variant='unstyled'
                type='button'
                onClick={() => {
                  if (balance > 0) {
                    setFieldValue('amount', formatBalance(balance))
                  }
                }}
                className={clsx('text-text-secondary', classNames)}
              >
                Max
              </Button>
            )}
          />
        </div>
        <div className={clsx('flex', 'mt-6', 'justify-center')}>
          <Button type='submit' className='w-full'>
            Send Tip <BsCash className='ml-3' />
          </Button>
        </div>
      </form>
    </Modal>
  )
}
