import { ReactionType, SpaceData } from '@subsocial/api/types'

// Important Types
export interface Profile extends SpaceData {
  followersCount: number
  followedCount: number
}

export interface Reaction {
  created: {
    account: string
    block: number
    time: number
  }
  id: number
  kind: ReactionType
  updated: number
}

// Query Params
export type GetProfileParam = { address: string }
export type GetFollowersParam = { address: string }
export type GetFollowingParam = { address: string }
export type GetIsCurrentUserFollowingParam = {
  currentUserAddress: string
  target: string
}
export type GetFollowingParam = { address: string }
export type GetReactionByPostIdAndAccountParam = {
  address: string
  postId: string
}
export type GetBatchReactionsByPostIdsAndAccountParam = {
  address: string
  postIds: string[]
}
export type GetReplyIdsByPostIdParam = {
  postId: string
}
export type GetBatchReplyIdsByPostIdsParam = {
  postIds: string[]
}
export type GetPostParam = {
  postId: string
}
export type GetRepliesParam = {
  postId: string
}

// Mutation Params
export type UpsertReactionPayload = {
  postId: string
  kind: ReactionType | ''
  reactionId?: number
}
export type CreateQuestionPayload = {
  title: string
  body: string
  tags: string[]
}
export type UpdateProfilePayload = {
  profileId?: string
  name?: string
  about?: string
  avatar?: File | string
}
export type CreateSpacePayload = {
  name: string
  desc?: string
  avatar?: File
}
export type CreateAnswerPayload = {
  rootPostId: string
  body: string
  isAnswer?: boolean
}
export type ToggleFollowAccountPayload = {
  target: string
  isCurrentlyFollowing: boolean
  targetName?: string
}
