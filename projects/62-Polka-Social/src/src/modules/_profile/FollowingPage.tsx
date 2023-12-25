import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import TwoColumnsPageLayout from '#/containers/layouts/TwoColumnsPageLayout'
import UserGridView from '#/containers/UserGridView'
import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { useGetFollowing } from '#/services/subsocial/queries'
import clsx from 'clsx'
import ProfileSection from './ProfilePage/ProfileSection'

export default function FollowingPage() {
  const [wallet] = useWalletContext()
  const { data, isFetched, isLoading } = useGetFollowing({
    address: encodeAddress(wallet?.address),
  })
  const { loadingChecker } = useIntegratedSkeleton(isLoading, isFetched)

  return (
    <TwoColumnsPageLayout
      leftSection={
        <div className='flex flex-col'>
          <h1 className='text-2xl mb-6'>Your Following</h1>
          <UserGridView
            users={data ?? []}
            isLoading={loadingChecker(data)}
            noDataNotice="You haven't followed anyone yet"
            noticeClassName={clsx('text-text-secondary')}
          />
        </div>
      }
      rightSection={<ProfileSection />}
    />
  )
}
