import { getSpaceId } from '#/lib/helpers/env'
import { SubsocialApi } from '@subsocial/api'
import { AnyReactionId, SpaceData } from '@subsocial/api/types'
import { bnsToIds, idToBn } from '@subsocial/utils'
import {
  GetBatchReactionsByPostIdsAndAccountParam,
  GetBatchReplyIdsByPostIdsParam,
  GetFollowersParam,
  GetFollowingParam,
  GetIsCurrentUserFollowingParam,
  GetPostParam,
  GetProfileParam,
  GetReactionByPostIdAndAccountParam,
  GetRepliesParam,
  GetReplyIdsByPostIdParam,
  Profile,
  Reaction,
} from './types'

export async function getProfile({
  additionalData: api,
  params,
}: {
  params: GetProfileParam
  additionalData: SubsocialApi
}): Promise<Profile | undefined> {
  let profile: SpaceData | undefined
  let followersCount = 0
  let followedCount = 0
  try {
    const fetches = [
      api.findProfileSpace(params.address),
      api.blockchain.accountFollowersCountByAccountId(params.address),
      api.blockchain.accountsFollowedCountByAccount(params.address),
    ] as const

    const fetchesRes = await Promise.all(fetches)
    profile = fetchesRes[0]
    followersCount = fetchesRes[1].toNumber()
    followedCount = fetchesRes[2].toNumber()
  } catch {}

  if (!profile) {
    return undefined
  }

  return {
    ...profile,
    followersCount,
    followedCount,
  }
}

export async function getFollowers({
  additionalData: api,
  params,
}: {
  params: GetFollowersParam
  additionalData: SubsocialApi
}) {
  const substrateApi = await api.substrateApi
  const res = (await substrateApi.query.profileFollows.accountFollowers(
    params.address
  )) as any
  const followersOfAccount = bnsToIds(res)
  const followers = await api.findProfileSpaces(followersOfAccount)
  return followers.map((profile, idx) => ({
    ...profile,
    address: followersOfAccount[idx],
  }))
}

export async function getFollowing({
  additionalData: api,
  params,
}: {
  params: GetFollowingParam
  additionalData: SubsocialApi
}) {
  const substrateApi = await api.substrateApi
  const res =
    (await substrateApi.query.profileFollows.accountsFollowedByAccount(
      params.address
    )) as any
  const followingIds = bnsToIds(res)
  const followings = await api.findProfileSpaces(followingIds)
  return followings.map((profile, idx) => ({
    ...profile,
    address: followingIds[idx],
  }))
}

export function getIsCurrentUserFollowing({
  additionalData: api,
  params,
}: {
  params: GetIsCurrentUserFollowingParam
  additionalData: SubsocialApi
}) {
  return api.blockchain.isAccountFollower(
    params.currentUserAddress,
    params.target
  )
}

export async function getReactionByPostIdAndAccount({
  additionalData: api,
  params,
}: {
  params: GetReactionByPostIdAndAccountParam
  additionalData: SubsocialApi
}) {
  const [reactionId] = await api.blockchain.getPostReactionIdsByAccount(
    params.address,
    [params.postId as any]
  )
  const reaction = await api.blockchain.findReaction(reactionId)
  return reaction?.toJSON() as any as Reaction
}

export async function getBatchReactionsByPostIdsAndAccount({
  additionalData: api,
  params,
}: {
  params: GetBatchReactionsByPostIdsAndAccountParam
  additionalData: SubsocialApi
}) {
  const substrateApi = await api.substrateApi
  const tuples = params.postIds.map((id) => [params.address, id])
  const reactionIds =
    await substrateApi.query.reactions.postReactionIdByAccount.multi(tuples)
  return (
    await api.blockchain.findReactions(
      reactionIds as unknown as AnyReactionId[]
    )
  ).map((reaction) => reaction.toJSON())
}

export async function getReplyIdsByPostId({
  additionalData: api,
  params,
}: {
  params: GetReplyIdsByPostIdParam
  additionalData: SubsocialApi
}) {
  return api.blockchain.getReplyIdsByPostId(idToBn(params.postId))
}

export async function getBatchReplyIdsByPostIds({
  additionalData: api,
  params,
}: {
  params: GetBatchReplyIdsByPostIdsParam
  additionalData: SubsocialApi
}) {
  const promises = params.postIds.map((id) =>
    api.blockchain.getReplyIdsByPostId(idToBn(id))
  )
  return Promise.all(promises)
}

export async function getPost({
  additionalData: api,
  params,
}: {
  params: GetPostParam
  additionalData: SubsocialApi
}) {
  return api.findPostWithSomeDetails({ id: params.postId as any })
}

export async function getAllQuestions({
  additionalData: api,
}: {
  additionalData: SubsocialApi
}) {
  const postIds = await api.blockchain.postIdsBySpaceId(getSpaceId() as any)
  return api.findPublicPosts(postIds)
}

export async function getReplies({
  params,
  additionalData: api,
}: {
  params: GetRepliesParam
  additionalData: SubsocialApi
}) {
  const replyIds = await getReplyIdsByPostId({ params, additionalData: api })
  return api.findPublicPostsWithSomeDetails({
    ids: replyIds,
  })
}
