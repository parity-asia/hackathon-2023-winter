import Link from '#/components/Link'
import ProfileImage from '#/components/ProfileImage'
import SkeletonFallback, {
  useIntegratedSkeleton,
} from '#/components/SkeletonFallback'
import { formatDate } from '#/lib/helpers/date'
import { getImageUrlFromIPFS } from '#/lib/helpers/image-url-generator'
import useIsCurrentUser from '#/lib/hooks/isCurrentUser'
import { useGetProfile } from '#/services/subsocial/queries'
import { SpaceData } from '@subsocial/api/types'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import { HTMLProps } from 'react'
import Reputation from '../Reputation'
import TippingButton from '../TippingButton'

export interface CreatorProps extends HTMLProps<HTMLDivElement> {
  creator?: SpaceData
  createDate?: number
  isLoading?: boolean
  creatorId?: string
  shouldFetchCreator?: boolean
  displayAskDate?: boolean
}

export default function CreatorOverview({
  creator,
  className,
  createDate,
  isLoading,
  creatorId,
  shouldFetchCreator = false,
  displayAskDate = false,
  ...props
}: CreatorProps) {
  const {
    data: localCreator,
    isLoading: localIsLoading,
    isFetched: localIsFetched,
  } = useGetProfile({ address: creatorId }, { enabled: shouldFetchCreator })

  const { IntegratedSkeleton, loadingChecker } = useIntegratedSkeleton(
    isLoading || localIsLoading,
    localIsFetched || !shouldFetchCreator
  )
  const usedCreator = creator ?? localCreator

  const isCurrentUser = useIsCurrentUser(creatorId)

  return (
    <div
      className={clsx(
        'bg-bg-100',
        displayAskDate ? 'py-2 px-3' : 'px-6 py-4',
        'rounded-md',
        className
      )}
      {...props}
    >
      <div className={clsx('flex items-center', 'space-x-2.5')}>
        <ProfileImage
          className={clsx('w-8')}
          isLoading={loadingChecker(usedCreator?.content?.image)}
          src={
            usedCreator?.content?.image &&
            getImageUrlFromIPFS(usedCreator?.content.image)
          }
        />
        <div className={clsx('flex flex-col', 'flex-1')}>
          <div
            className={clsx('text-sm font-bold', 'mb-0.5', 'flex items-center')}
          >
            <Link
              variant='primary'
              href={`/profile/${isCurrentUser ? '' : creatorId}`}
              className={clsx('mr-4')}
            >
              <IntegratedSkeleton
                content={isCurrentUser ? 'You' : usedCreator?.content?.name}
                defaultContent={truncateMiddle(creatorId)}
                width={100}
              >
                {(name) => (isCurrentUser ? 'You' : name)}
              </IntegratedSkeleton>
            </Link>
            {!isCurrentUser && (
              <Reputation
                className={clsx('font-normal ml-auto', 'text-text-secondary')}
                address={creatorId ?? ''}
              />
            )}
            {creatorId && (
              <TippingButton
                className={clsx('ml-3', 'text-lg')}
                dest={creatorId}
                profile={usedCreator}
              />
            )}
          </div>
          {displayAskDate && (
            <p className={clsx('text-xs text-text-secondary', 'mb-1')}>
              asked{' '}
              <SkeletonFallback isLoading={isLoading} inline width={60}>
                {createDate ? formatDate(createDate) : '-'}
              </SkeletonFallback>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
