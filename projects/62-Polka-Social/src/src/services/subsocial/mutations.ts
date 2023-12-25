import { DEFAULT_SPACE_PERMISSIONS } from '#/lib/constants/subsocial'
import { encodeAddress } from '#/lib/helpers/chain'
import { getSpaceId } from '#/lib/helpers/env'
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { truncateMiddle } from '@talisman-connect/ui'
import { MutationConfig } from '../common/types'
import { Transaction, useSubsocialMutation } from './base'
import {
  invalidateGetAllQuestions,
  invalidateGetFollowers,
  invalidateGetFollowing,
  invalidateGetIsCurrentUserFollowing,
  invalidateGetPost,
  invalidateGetProfile,
  invalidateGetReactionByPostIdAndAccount,
  invalidateGetReplies,
  invalidateGetReplyIdsByPostId,
} from './queries'
import {
  CreateAnswerPayload,
  CreateQuestionPayload,
  CreateSpacePayload,
  ToggleFollowAccountPayload,
  UpdateProfilePayload,
  UpsertReactionPayload,
} from './types'

export function useCreateSpace(config?: MutationConfig<CreateSpacePayload>) {
  return useSubsocialMutation(async (data, { ipfsApi, substrateApi }) => {
    const { avatar, name, desc } = data
    let avatarCid: string | undefined
    if (avatar) {
      avatarCid = await ipfsApi.saveFile(avatar)
    }
    const spaceCid = await ipfsApi.saveContent({
      name,
      about: desc,
      image: avatarCid,
    } as any)
    const tx = substrateApi.tx.spaces.createSpace(
      IpfsContent(spaceCid),
      DEFAULT_SPACE_PERMISSIONS
    ) as unknown as Transaction
    return { tx, summary: `Creating Space ${name}` }
  }, config)
}

export function useCreatePost(config?: MutationConfig<CreateQuestionPayload>) {
  return useSubsocialMutation(
    async (data, { ipfsApi, substrateApi }) => {
      const { title, body, tags } = data
      const postCid = await ipfsApi.saveContent({
        title,
        body,
        tags,
      } as any)
      const tx = substrateApi.tx.posts.createPost(
        getSpaceId(),
        { RegularPost: null },
        IpfsContent(postCid)
      ) as unknown as Transaction
      return { tx, summary: `Creating Post` }
    },
    config,
    {
      onTxSuccess: () => {
        invalidateGetAllQuestions()
      },
    }
  )
}

export function useUpdateProfile(
  config?: MutationConfig<UpdateProfilePayload>
) {
  return useSubsocialMutation(
    async (data, { ipfsApi, substrateApi }) => {
      const { about, avatar, name, profileId } = data
      let avatarCid = undefined
      if (typeof avatar === 'object') {
        avatarCid = await ipfsApi.saveFile(avatar)
      } else if (typeof avatar === 'string') {
        avatarCid = avatar
      }
      const profileCid = await ipfsApi.saveContent({
        image: avatarCid,
        name,
        about,
      } as any)
      let tx
      if (profileId) {
        tx = substrateApi.tx.spaces.updateSpace(profileId, {
          content: IpfsContent(profileCid),
        })
      } else {
        tx = substrateApi.tx.spaces.createSpace(IpfsContent(profileCid), null)
      }
      return { tx: tx as unknown as Transaction, summary: `Updating Profile` }
    },
    config,
    {
      onTxSuccess: (_, address) => {
        invalidateGetProfile({ address: encodeAddress(address) })
      },
    }
  )
}

export function useUpsertReaction(
  config?: MutationConfig<UpsertReactionPayload>
) {
  return useSubsocialMutation(
    async (data, { substrateApi }) => {
      const { kind, postId, reactionId } = data
      let tx
      const reactionActionMapper = {
        Downvote: 'Downvoting post',
        Upvote: 'Upvoting post',
        '': 'Deleting reaction',
      }
      const summary = reactionActionMapper[kind]
      if (reactionId) {
        if (kind === '') {
          tx = substrateApi.tx.reactions.deletePostReaction(postId, reactionId)
        } else {
          tx = substrateApi.tx.reactions.updatePostReaction(
            postId,
            reactionId,
            kind
          )
        }
      } else {
        if (kind) {
          tx = substrateApi.tx.reactions.createPostReaction(postId, kind)
        } else {
          throw new Error('Reaction cannot be empty')
        }
      }
      return { tx: tx as unknown as Transaction, summary }
    },
    config,
    {
      onTxSuccess: (data, address) => {
        invalidateGetReactionByPostIdAndAccount({
          postId: data.postId,
          address: encodeAddress(address),
        })
        invalidateGetPost({
          postId: data.postId,
        })
      },
    }
  )
}

export function useCreateReply(config?: MutationConfig<CreateAnswerPayload>) {
  return useSubsocialMutation(
    async (data, { substrateApi, ipfsApi }) => {
      const { body, rootPostId, isAnswer } = data
      const postCid = await ipfsApi.saveContent({
        body,
        isAnswer,
      } as any)
      const tx = substrateApi.tx.posts.createPost(
        parseInt(getSpaceId()),
        { Comment: { parentId: null, rootPostId } },
        IpfsContent(postCid)
      ) as unknown as Transaction
      return { tx, summary: isAnswer ? `Answering question` : 'Replying' }
    },
    config,
    {
      onTxSuccess: (data, address) => {
        invalidateGetReplyIdsByPostId({
          postId: data.rootPostId,
        })
        invalidateGetReplies({
          postId: data.rootPostId,
        })
      },
    }
  )
}

export function useToggleFollowAccount(
  config?: MutationConfig<ToggleFollowAccountPayload>
) {
  return useSubsocialMutation(
    async (data, { substrateApi }) => {
      const { target, isCurrentlyFollowing, targetName } = data
      let tx
      let summary
      if (isCurrentlyFollowing) {
        tx = substrateApi.tx.profileFollows.unfollowAccount(target)
        summary = 'Unfollowing'
      } else {
        tx = substrateApi.tx.profileFollows.followAccount(target)
        summary = 'Following'
      }
      summary = `${summary} ${targetName || truncateMiddle(target)}`
      return { tx: tx as unknown as Transaction, summary }
    },
    config,
    {
      onTxSuccess: (data, address) => {
        invalidateGetIsCurrentUserFollowing({
          currentUserAddress: encodeAddress(address),
          target: encodeAddress(data.target),
        })
        invalidateGetProfile({ address: encodeAddress(data.target) })
        invalidateGetProfile({ address: encodeAddress(address) })
        invalidateGetFollowers({ address: encodeAddress(address) })
        invalidateGetFollowing({ address: encodeAddress(address) })
      },
    }
  )
}
