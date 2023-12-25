import AddressCopy from '#/components/AddressCopy'
import Button, { ButtonProps } from '#/components/Button'
import Link from '#/components/Link'
import PopOver from '#/components/PopOver'
import ProfileImage from '#/components/ProfileImage'
import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import { mainTokenTicker } from '#/lib/config/subsocial-api'
import { encodeAddress, formatBalance } from '#/lib/helpers/chain'
import { getImageUrlFromIPFS } from '#/lib/helpers/image-url-generator'
import useLogout from '#/lib/hooks/useLogout'
import { useGetTokenBalance } from '#/services/all-chains/queries'
import { useGetCurrentUser } from '#/services/subsocial/queries'
import { WalletAccount } from '@talisman-connect/wallets'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { BsCash } from 'react-icons/bs'
import Reputation from '../Reputation'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export interface WalletProfileProps extends ButtonProps {
  wallet: WalletAccount
}

export default function WalletProfile({
  wallet,
  className,
  ...props
}: WalletProfileProps) {
  const logout = useLogout()
  const { data, isLoading, isFetched } = useGetCurrentUser()
  const content = data?.content
  const { IntegratedSkeleton, loadingChecker } = useIntegratedSkeleton(
    isLoading,
    isFetched
  )

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isFetched: isFetchedBalance,
  } = useGetTokenBalance({
    address: wallet.address,
    network: mainTokenTicker,
  })
  const { IntegratedSkeleton: IntegratedBalanceSkeleton } =
    useIntegratedSkeleton(isLoadingBalance, isFetchedBalance)

  const encodedWalletAddress = encodeAddress(wallet.address)

  return (
    <PopOver
      trigger={
        <Button
          {...props}
          variant='unstyled'
          innerContainerClassName={clsx('flex items-center space-x-2')}
          className={clsx('border border-bg-200', className)}
          rounded
          size='content'
        >
          <p className={clsx('pl-4')}>{wallet.name}</p>
          <ProfileImage
            className={clsx('w-9')}
            src={(wallet as any).avatar ?? wallet.wallet?.logo}
          />
        </Button>
      }
    >
      <div
        className={clsx('rounded-md bg-bg-200', 'p-4 w-60', 'flex flex-col')}
      >
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 shrink-0'>
            <ProfileImage
              isLoading={loadingChecker(content?.image)}
              src={
                content?.image
                  ? getImageUrlFromIPFS(content.image)
                  : (wallet as any).avatar
              }
            />
          </div>
          <div className={clsx('text-sm', 'flex-1')}>
            <IntegratedSkeleton
              count={2}
              width='100%'
              content={content?.name}
              defaultContent={
                <AddressCopy className={clsx('font-bold')}>
                  {encodedWalletAddress}
                </AddressCopy>
              }
            >
              {(name) => (
                <div className={clsx('flex flex-col')}>
                  <p className={clsx('leading-snug', 'font-bold')}>{name}</p>
                  <AddressCopy className={clsx('text-xs text-text-secondary')}>
                    {encodedWalletAddress}
                  </AddressCopy>
                </div>
              )}
            </IntegratedSkeleton>
          </div>
        </div>
        <div className='flex flex-col mt-3 text-xs'>
          <div className={clsx('flex items-center', 'mb-1', 'space-x-4')}>
            <IntegratedBalanceSkeleton content={balance} width={75}>
              {(value) => (
                <p className={clsx('flex items-center')}>
                  <BsCash className='inline mr-1.5' /> {formatBalance(value)}{' '}
                  {mainTokenTicker}
                </p>
              )}
            </IntegratedBalanceSkeleton>
            <Reputation address={wallet.address} />
          </div>
          <p className='text-text-secondary'>
            <IntegratedSkeleton content={content?.about}>
              {(about) => (
                <RichTextArea
                  asReadOnlyContent={{ content: about }}
                  name='about'
                />
              )}
            </IntegratedSkeleton>
          </p>
        </div>
        <Link href='/profile'>
          <Button className='mt-4 w-full text-sm' size='small'>
            My Profile
          </Button>
        </Link>
        <Button
          variant='outlined-red'
          className='mt-2 text-sm'
          size='small'
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>
    </PopOver>
  )
}
