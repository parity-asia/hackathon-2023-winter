import Link from '#/components/Link'
import SkeletonFallback from '#/components/SkeletonFallback'
import clsx from 'clsx'
import { HTMLProps } from 'react'

export interface FollowingFollowerCountProps extends HTMLProps<HTMLDivElement> {
  followerCount?: number
  followingCount?: number
  isLoading?: boolean
}

export default function FollowingFollowerCount({
  className,
  isLoading,
  followerCount,
  followingCount,
  ...props
}: FollowingFollowerCountProps) {
  return (
    <div
      className={clsx('flex items-center', 'flex space-x-2', className)}
      {...props}
    >
      <Link
        variant='primary'
        className={clsx('text-sm', '!text-text-primary text-center')}
        href='/profile/followers'
      >
        <SkeletonFallback
          className={clsx('w-[3ch]')}
          inline
          isLoading={isLoading}
        >
          {followerCount ?? 0}
        </SkeletonFallback>{' '}
        Followers
      </Link>
      <span className='text-lg font-bold'> &middot; </span>
      <Link
        variant='primary'
        className={clsx('text-sm', '!text-text-primary text-center')}
        href='/profile/following'
      >
        <SkeletonFallback
          className={clsx('w-[3ch]')}
          inline
          isLoading={isLoading}
        >
          {followingCount ?? 0}
        </SkeletonFallback>{' '}
        Following
      </Link>
    </div>
  )
}
