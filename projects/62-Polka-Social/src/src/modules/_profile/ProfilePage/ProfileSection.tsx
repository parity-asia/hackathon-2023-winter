import AddressCopy from '#/components/AddressCopy'
import Button from '#/components/Button'
import Link from '#/components/Link'
import ProfileImage from '#/components/ProfileImage'
import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import FollowingFollowerCount from '#/containers/FollowingFollowerCount'
import Reputation from '#/containers/Reputation'
import TippingButton from '#/containers/TippingButton'
import TransactionModal from '#/containers/TransactionModal'
import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { getImageUrlFromIPFS } from '#/lib/helpers/image-url-generator'
import useIsCurrentUser from '#/lib/hooks/isCurrentUser'
import useLogout from '#/lib/hooks/useLogout'
import { useToggleFollowAccount } from '#/services/subsocial/mutations'
import {
  useGetIsCurrentUserFollowing,
  useGetProfile,
} from '#/services/subsocial/queries'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsBoxArrowInRight, BsPencil } from 'react-icons/bs'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export default function ProfileSection() {
  const [wallet] = useWalletContext()
  const logout = useLogout()

  const { query } = useRouter()
  const id = query.id as string | undefined
  const address = id ? encodeAddress(id) : encodeAddress(wallet?.address) ?? ''
  const { data, isLoading, isFetched } = useGetProfile({
    address,
  })
  const content = data?.content
  const { IntegratedSkeleton, loadingChecker } = useIntegratedSkeleton(
    isLoading,
    isFetched
  )

  const {
    data: isFollowing,
    isLoading: isLoadingCheckFollowing,
    isFetched: isFetchedCheckFollowing,
  } = useGetIsCurrentUserFollowing({
    currentUserAddress: encodeAddress(wallet?.address),
    target: id,
  })
  const { IntegratedSkeleton: IntegratedSkeletonCheckFollowing } =
    useIntegratedSkeleton(isLoadingCheckFollowing, isFetchedCheckFollowing)

  const [openModal, setOpenModal] = useState(false)
  const {
    mutate: toggleFollow,
    isLoading: isLoadingFollow,
    error: errorFollow,
  } = useToggleFollowAccount()
  const toggleFollowAccount = () => {
    if (!id || isFollowing === undefined) return
    setOpenModal(true)
    toggleFollow({
      target: id,
      isCurrentlyFollowing: isFollowing,
      targetName: content?.name,
    })
  }

  const _isCurrentUser = useIsCurrentUser(id)
  const isCurrentUser = !id || _isCurrentUser

  return (
    <>
      <TransactionModal
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
        action={
          (isFollowing ? 'Unfollow ' : 'Follow ') +
          (content?.name ?? truncateMiddle(id))
        }
        isLoading={isLoadingFollow}
        errorMsg={errorFollow?.message}
      />
      <div className={clsx('flex flex-col')}>
        <div className={clsx('flex justify-between')}>
          <ProfileImage
            className='w-28 h-28'
            isLoading={loadingChecker(content?.image)}
            src={content?.image && getImageUrlFromIPFS(content.image)}
          />
          <div className={clsx('mt-3')}>
            <div className={clsx('flex items-center', 'space-x-3')}>
              {isCurrentUser ? (
                <>
                  <Link href='/profile/edit'>
                    <Button
                      variant='unstyled-border'
                      className={clsx('text-blue-400')}
                      size='icon-medium'
                      rounded
                    >
                      <BsPencil />
                    </Button>
                  </Link>
                  <Button
                    variant='unstyled-border'
                    className={clsx('text-red-500')}
                    size='icon-medium'
                    rounded
                    onClick={logout}
                  >
                    <BsBoxArrowInRight />
                  </Button>
                </>
              ) : (
                <TippingButton
                  variant='unstyled-border'
                  className={clsx('text-brand')}
                  size='icon-medium'
                  dest={address}
                  profile={data}
                />
              )}
            </div>
          </div>
        </div>
        <div className={clsx('font-bold text-lg', 'mt-2')}>
          <IntegratedSkeleton
            content={content?.name}
            defaultContent={
              <AddressCopy>
                {encodeAddress(id ?? encodeAddress(wallet?.address))}
              </AddressCopy>
            }
          >
            {(name) => <p>{name}</p>}
          </IntegratedSkeleton>
        </div>
        {content?.name && (
          <AddressCopy
            className={clsx('mb-4', 'text-text-secondary', 'text-xs')}
          >
            {data?.id ?? ''}
          </AddressCopy>
        )}
        <FollowingFollowerCount
          isLoading={loadingChecker(data?.struct)}
          followingCount={(data as any)?.struct?.followingAccountsCount}
          followerCount={(data as any)?.struct?.followersCount}
          className={clsx('mt-')}
        />
        <Reputation address={address} className={clsx('text-sm')} />
        <IntegratedSkeleton className={clsx('mt-6')} content={content?.about}>
          {(about) => (
            <div className={clsx('text-text-secondary text-sm', 'mt-6')}>
              <RichTextArea
                name='about'
                asReadOnlyContent={{ content: about }}
              />
            </div>
          )}
        </IntegratedSkeleton>
        {!isCurrentUser && (
          <div className='mt-8 text-sm'>
            <IntegratedSkeletonCheckFollowing
              width={100}
              content={{}}
              className={clsx('h-8')}
            >
              {() => (
                <Button
                  variant={isFollowing ? 'unstyled-border' : 'filled-brand'}
                  onClick={toggleFollowAccount}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </IntegratedSkeletonCheckFollowing>
          </div>
        )}
      </div>
    </>
  )
}
