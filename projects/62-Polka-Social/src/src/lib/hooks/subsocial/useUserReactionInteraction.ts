import { useUpsertReaction } from '#/services/subsocial/mutations'
import { useGetUserReactionByPostId } from '#/services/subsocial/queries'
import { ReactionType } from '@subsocial/api/types'
import { useRef } from 'react'

export default function useUserReactionInteraction(
  postId?: string,
  actionSuffix = '',
  onAfterClick?: () => void
) {
  const userReaction = useGetUserReactionByPostId({ postId })
  const { data: reaction } = userReaction
  const { mutate: upsertReaction, ...mutationData } = useUpsertReaction()
  const actionRef = useRef('')

  const isDownVoted = reaction?.kind === 'Downvote'
  const isUpVoted = reaction?.kind === 'Upvote'

  const setAction = (reactionType: ReactionType | '') => {
    const actionSuffixWithSpace = actionSuffix ? ` ${actionSuffix}` : ''
    if (reactionType === '') {
      if (isDownVoted) actionRef.current = 'Removing your downvote'
      else actionRef.current = 'Removing your upvote'
    } else if (reactionType === 'Downvote') {
      actionRef.current = `Downvoting${actionSuffixWithSpace}`
    } else {
      actionRef.current = `Upvoting${actionSuffixWithSpace}`
    }
  }

  const onClickReaction = (kind: ReactionType) => {
    const shouldDeleteReaction =
      (kind === 'Downvote' && isDownVoted) || (kind === 'Upvote' && isUpVoted)
    if (!postId) return
    console.log('UPSERTING REACTION...')
    const reactionType = shouldDeleteReaction ? '' : kind
    upsertReaction({
      kind: reactionType,
      postId,
      reactionId: reaction?.id,
    })
    setAction(reactionType)
    onAfterClick && onAfterClick()
  }

  return {
    userReaction,
    mutationData,
    onClickReaction,
    isDownVoted,
    isUpVoted,
    action: actionRef.current,
  }
}
