import { renderElementOrCustom } from '#/lib/helpers/renderer'
import { SpaceData } from '@subsocial/api/types'
import clsx from 'clsx'
import { HTMLProps } from 'react'
import CreatorOverview from './PostDetail/CreatorOverview'

export interface UserGridViewProps extends HTMLProps<HTMLDivElement> {
  users: (SpaceData & { address: string })[]
  isLoading?: boolean
  noDataNotice?: string | JSX.Element
  noticeClassName?: string
}

export default function UserGridView({
  users,
  className,
  isLoading,
  noDataNotice,
  noticeClassName,
  ...props
}: UserGridViewProps) {
  return (
    <>
      <div
        className={clsx(
          'grid grid-cols-[repeat(auto-fill,_minmax(240px,_240px))] gap-4',
          className
        )}
        {...props}
      >
        {(() => {
          if (isLoading) {
            return Array.from({ length: 3 }).map((_, idx) => (
              <CreatorOverview isLoading key={idx} />
            ))
          } else if ((users?.length ?? 0) > 0) {
            return users.map((user) => (
              <CreatorOverview
                className={clsx('w-60')}
                creator={user}
                creatorId={user.address}
                key={user.address}
              />
            ))
          }
        })()}
      </div>
      {!isLoading &&
        users.length === 0 &&
        renderElementOrCustom(noDataNotice, (notice) => (
          <p className={noticeClassName}>{notice ?? 'No user data'}</p>
        ))}
    </>
  )
}
