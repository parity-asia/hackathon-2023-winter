import { useWalletContext } from '#/contexts/WalletContext'
import { encodeAddress } from '#/lib/helpers/chain'
import { SpaceData } from '@subsocial/api/types'
import queryClient from '../client'
import { createQueryInvalidation } from '../common/base'
import { QueryConfig } from '../common/types'
import {
  getAllQuestions,
  getBatchReactionsByPostIdsAndAccount,
  getFollowers,
  getFollowing,
  getIsCurrentUserFollowing,
  getPost,
  getProfile,
  getReactionByPostIdAndAccount,
  getReplies,
  getReplyIdsByPostId,
} from './api'
import { useSubsocialQuery } from './base'
import {
  GetFollowersParam,
  GetFollowingParam,
  GetIsCurrentUserFollowingParam,
  GetPostParam,
  GetProfileParam,
  GetReactionByPostIdAndAccountParam,
  GetRepliesParam,
  GetReplyIdsByPostIdParam,
} from './types'

const setProfilesQueryCache = (
  profiles: (SpaceData & { address: string })[]
) => {
  const promises = profiles.map((profile) => {
    return queryClient.setQueryData([getProfile, profile.address], profile)
  })
  return Promise.all(promises)
}
export const getProfileKey = 'getProfile'
export const invalidateGetProfile =
  createQueryInvalidation<GetProfileParam>(getProfileKey)
export function useGetProfile(
  data: Partial<GetProfileParam>,
  config?: QueryConfig
) {
  return useSubsocialQuery(
    { key: getProfileKey, data: { address: data.address ?? '' } },
    getProfile,
    config,
    { enabled: !!data?.address }
  )
}
export function useGetCurrentUser() {
  const [wallet] = useWalletContext()
  return useSubsocialQuery(
    {
      key: getProfileKey,
      data: { address: encodeAddress(wallet?.address) ?? '' },
    },
    getProfile,
    { enabled: !!wallet?.address }
  )
}

export const getFollowersKey = 'getFollowers'
export const invalidateGetFollowers =
  createQueryInvalidation<GetFollowersParam>(getFollowersKey)
export function useGetFollowers(
  data: Partial<GetFollowersParam>,
  config?: QueryConfig
) {
  return useSubsocialQuery(
    {
      key: getFollowersKey,
      data: { address: data.address ?? '' },
    },
    async function (queryData) {
      const res = await getFollowers(queryData)
      await setProfilesQueryCache(res)
      return res
    },
    config,
    { enabled: !!data?.address }
  )
}

export const getFollowingKey = 'getFollowing'
export const invalidateGetFollowing =
  createQueryInvalidation<GetFollowingParam>(getFollowingKey)
export function useGetFollowing(
  data: Partial<GetFollowingParam>,
  config?: QueryConfig
) {
  return useSubsocialQuery(
    {
      key: getFollowingKey,
      data: { address: data.address ?? '' },
    },
    async function (queryData) {
      const res = await getFollowing(queryData)
      await setProfilesQueryCache(res)
      return res
    },
    config,
    { enabled: !!data?.address }
  )
}

export const getIsCurrentUserFollowingKey = 'getIsCurrentUserFollowing'
export const invalidateGetIsCurrentUserFollowing =
  createQueryInvalidation<GetIsCurrentUserFollowingParam>(
    getIsCurrentUserFollowingKey
  )
export function useGetIsCurrentUserFollowing(
  data: Partial<GetIsCurrentUserFollowingParam>,
  config?: QueryConfig
) {
  return useSubsocialQuery(
    {
      key: getIsCurrentUserFollowingKey,
      data: {
        currentUserAddress: data.currentUserAddress ?? '',
        target: data.target ?? '',
      },
    },
    getIsCurrentUserFollowing,
    config,
    { enabled: !!data?.currentUserAddress && !!data.target }
  )
}

export const getReactionByPostIdAndAccountKey = 'getReactionByPostIdAndAccount'
export const invalidateGetReactionByPostIdAndAccount =
  createQueryInvalidation<GetReactionByPostIdAndAccountParam>(
    getReactionByPostIdAndAccountKey
  )
export function useGetReactionByPostIdAndAccount(
  data: GetReactionByPostIdAndAccountParam
) {
  return useSubsocialQuery(
    { key: getReactionByPostIdAndAccountKey, data },
    getReactionByPostIdAndAccount
  )
}
export function useGetUserReactionByPostId(
  data: Partial<Omit<GetReactionByPostIdAndAccountParam, 'address'>>
) {
  const [wallet] = useWalletContext()
  const address = encodeAddress(wallet?.address) ?? ''
  const postId = data.postId ?? ''
  const usedData: GetReactionByPostIdAndAccountParam = {
    address,
    postId,
  }
  return useSubsocialQuery(
    { key: getReactionByPostIdAndAccountKey, data: usedData },
    getReactionByPostIdAndAccount,
    { enabled: !!address && !!postId }
  )
}

export const getReplyIdsByPostIdKey = 'getReplyIdsByPostId'
export const invalidateGetReplyIdsByPostId =
  createQueryInvalidation<GetReplyIdsByPostIdParam>(getReplyIdsByPostIdKey)
export function useGetReplyIdsByPostId(
  data: Partial<GetReplyIdsByPostIdParam>
) {
  return useSubsocialQuery(
    { key: getReplyIdsByPostIdKey, data: { postId: data.postId! } },
    getReplyIdsByPostId,
    { enabled: !!data.postId }
  )
}

export const getPostKey = 'getPost'
export const invalidateGetPost =
  createQueryInvalidation<GetPostParam>(getPostKey)
export function useGetPost(data: GetPostParam, config?: QueryConfig) {
  return useSubsocialQuery({ data, key: getPostKey }, getPost, config)
}

export const getRepliesKey = 'getReplies'
export const invalidateGetReplies =
  createQueryInvalidation<GetRepliesParam>(getRepliesKey)
export function useGetReplies(
  data: Partial<GetRepliesParam>,
  config?: QueryConfig
) {
  return useSubsocialQuery(
    { data: { postId: data.postId ?? '' }, key: getRepliesKey },
    async (queryData) => {
      const replies = await getReplies(queryData)
      const promises = replies.map((reply) =>
        queryClient.setQueryData([getPostKey, { postId: reply.id }], reply)
      )
      return Promise.all(promises)
    },
    config,
    { enabled: !!data.postId }
  )
}

export const getAllQuestionsKey = 'getAllQuestions'
export const invalidateGetAllQuestions =
  createQueryInvalidation(getAllQuestionsKey)
export function useGetAllQuestions() {
  const [wallet] = useWalletContext()

  return useSubsocialQuery(
    { key: getAllQuestionsKey, data: null },
    async ({ additionalData: api }) => {
      const questions = await getAllQuestions({ additionalData: api })

      async function getReactionsFromUser() {
        if (!wallet) return
        const reactions = await getBatchReactionsByPostIdsAndAccount({
          params: {
            address: wallet.address,
            postIds: questions.map(({ id }) => id),
          },
          additionalData: api,
        })
        const promises = reactions.map((reaction, idx) => {
          const param: GetReactionByPostIdAndAccountParam = {
            address: wallet.address,
            postId: questions[idx].id.toString() as any,
          }
          return queryClient.setQueryData(
            [getReactionByPostIdAndAccountKey, param],
            reaction
          )
        })

        return Promise.all(promises)
      }
      await getReactionsFromUser()

      // TODO: This is disabled until there is better way to batch get reply. Currently its better to just fetch it when needed
      // async function getReplyIds() {
      //   const questionReplyIds = await getBatchReplyIdsByPostIds(api, {
      //     postIds: questions.map(({ id }) => id),
      //   })
      //   const promises = questionReplyIds.map((replyIds, idx) => {
      //     const param: GetReplyIdsByPostIdParam = {
      //       postId: questions[idx].id.toString() as any,
      //     }
      //     return queryClient.setQueryData(
      //       [getReplyIdsByPostIdKey, param],
      //       replyIds
      //     )
      //   })
      //   return Promise.all(promises)
      // }
      // await getReplyIds()

      return questions
    }
  )
}
