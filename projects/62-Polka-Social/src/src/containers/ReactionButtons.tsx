import Button from '#/components/Button'
import ReactionArrowIcon from '#/components/ReactionArrowIcon'
import SkeletonFallback from '#/components/SkeletonFallback'
import useUserReactionInteraction from '#/lib/hooks/subsocial/useUserReactionInteraction'
import clsx from 'clsx'
import { HTMLProps, useState } from 'react'
import TransactionModal from './TransactionModal'

interface Props extends HTMLProps<HTMLDivElement> {
  isLoading?: boolean
  postId?: string
  upVoteCount?: number
  downVoteCount?: number
  noButtons?: boolean
  noDownVote?: boolean
}

export default function ReactionButtons({
  isLoading,
  postId,
  className,
  noButtons,
  noDownVote,
  downVoteCount = 0,
  upVoteCount = 0,
  ...props
}: Props) {
  const [openModal, setOpenModal] = useState(false)
  const {
    action,
    onClickReaction,
    userReaction: { isLoading: localIsLoading },
    mutationData: { isLoading: isLoadingInteraction, error: errorInteraction },
    isDownVoted,
    isUpVoted,
  } = useUserReactionInteraction(postId, 'Post', () => setOpenModal(true))

  const combinedIsLoading = isLoading || localIsLoading
  const buttonClassNames = clsx('flex space-x-2 items-center', 'text-xl')

  return (
    <>
      <TransactionModal
        handleClose={() => setOpenModal(false)}
        isOpen={openModal}
        action={action}
        isLoading={isLoadingInteraction}
        errorMsg={errorInteraction?.message}
      />
      <div
        className={clsx('flex flex-col items-center', 'space-y-2', className)}
        {...props}
      >
        {!noButtons && (
          <div>
            <Button
              variant='unstyled'
              rounded
              size='icon-medium'
              innerContainerClassName={buttonClassNames}
              disabled={combinedIsLoading}
              disabledCursor='loading'
              onClick={() => onClickReaction('Upvote')}
            >
              <SkeletonFallback width={25} isLoading={isLoading}>
                <ReactionArrowIcon type='Upvote' isActive={isUpVoted} />
              </SkeletonFallback>
            </Button>
          </div>
        )}
        <div
          className={clsx(
            'rounded-md',
            noButtons && 'bg-brand',
            'flex items-center justify-center',
            'w-[2.5rem] py-1 relative'
          )}
        >
          <SkeletonFallback
            color={noButtons ? 'brand' : 'default'}
            className={clsx('absolute', 'inset-0', 'w-full h-full')}
            isLoading={isLoading}
          >
            <p>{upVoteCount - downVoteCount}</p>
          </SkeletonFallback>
        </div>
        {!noButtons && !noDownVote && (
          <div>
            <Button
              variant='unstyled'
              rounded
              size='icon-medium'
              innerContainerClassName={buttonClassNames}
              disabled={combinedIsLoading}
              disabledCursor='loading'
              onClick={() => onClickReaction('Downvote')}
            >
              <SkeletonFallback width={25} isLoading={isLoading}>
                <ReactionArrowIcon type='Downvote' isActive={isDownVoted} />
              </SkeletonFallback>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
