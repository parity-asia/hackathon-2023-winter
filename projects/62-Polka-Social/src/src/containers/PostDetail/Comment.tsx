import Button from '#/components/Button'
import Link from '#/components/Link'
import ReactionArrowIcon from '#/components/ReactionArrowIcon'
import { formatDate } from '#/lib/helpers/date'
import useUserReactionInteraction from '#/lib/hooks/subsocial/useUserReactionInteraction'
import { useGetPost, useGetProfile } from '#/services/subsocial/queries'
import { PostWithSomeDetails } from '@subsocial/api/types'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import { HTMLProps, useState } from 'react'
import TransactionModal from '../TransactionModal'

export interface CommentsProps extends HTMLProps<HTMLDivElement> {
  comment: PostWithSomeDetails
  shouldFetchComment?: boolean
  commentId?: string
}

export default function Comment({
  comment,
  className,
  commentId,
  shouldFetchComment,
  ...props
}: CommentsProps) {
  const { data: localComment } = useGetPost(
    { postId: commentId! },
    { enabled: shouldFetchComment && !!commentId }
  )

  const [openModal, setOpenModal] = useState(false)
  const {
    isUpVoted,
    onClickReaction,
    action,
    userReaction: { isLoading },
    mutationData: { isLoading: isLoadingInteraction, error: errorInteraction },
  } = useUserReactionInteraction(comment.id, 'Reply', () => setOpenModal(true))

  const usedComment = localComment ?? comment
  const upVoteCount = usedComment.post.struct.upvotesCount
  const creatorId = usedComment.post.struct.createdByAccount

  const { data: profile } = useGetProfile({ address: creatorId })
  const creator = usedComment.owner ?? profile

  const createdAt = usedComment.post.struct.createdAtTime
  const commentBody = usedComment.post.content?.body

  return (
    <>
      <TransactionModal
        action={action}
        handleClose={() => setOpenModal(false)}
        isOpen={openModal}
        isLoading={isLoadingInteraction}
        errorMsg={errorInteraction?.message}
      />
      <div className={clsx('flex relative text-sm', className)} {...props}>
        <span className={clsx('absolute', '-left-1 -translate-x-full')}>
          {upVoteCount || ' '}
        </span>
        <div>
          <Button
            onClick={() => onClickReaction('Upvote')}
            disabled={isLoading}
            variant='unstyled'
            size='icon-small'
            rounded
            className={clsx('mr-2')}
          >
            <ReactionArrowIcon type='Upvote' isActive={isUpVoted} />
          </Button>
        </div>
        <p>
          {commentBody} -{' '}
          <Link
            variant='primary'
            className={clsx('font-bold')}
            href={`/profile/${creatorId}`}
          >
            {creator?.content?.name ?? truncateMiddle(creatorId)}
          </Link>
          <span className={clsx('text-text-disabled')}>
            {' '}
            {formatDate(createdAt)}
          </span>
        </p>
      </div>
    </>
  )
}
