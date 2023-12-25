import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import TwoColumnsPageLayout from '#/containers/layouts/TwoColumnsPageLayout'
import UserGridView from '#/containers/UserGridView'
import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { useGetFollowers } from '#/services/subsocial/queries'
import clsx from 'clsx'
import ProfileSection from './ProfilePage/ProfileSection'

export default function FollowersPage() {
  const [wallet] = useWalletContext()
  const { data, isFetched, isLoading } = useGetFollowers({
    address: encodeAddress(wallet?.address),
  })
  const { loadingChecker } = useIntegratedSkeleton(isLoading, isFetched)

  return (
    <TwoColumnsPageLayout
      leftSection={
        <div className='flex flex-col'>
          <h1 className='text-2xl mb-6'>Your Followers</h1>
          <UserGridView
            users={data ?? []}
            isLoading={loadingChecker(data)}
            noDataNotice='You have no followers yet'
            noticeClassName={clsx('text-text-secondary')}
          />
        </div>
      }
      rightSection={<ProfileSection />}
    />
  )
}
