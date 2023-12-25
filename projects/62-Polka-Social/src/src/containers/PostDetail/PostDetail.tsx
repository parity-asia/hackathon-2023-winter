import Button from '#/components/Button'
import TextArea from '#/components/inputs/TextArea'
import Link from '#/components/Link'
import SkeletonFallback, {
  useIntegratedSkeleton,
} from '#/components/SkeletonFallback'
import { useFilterAnswersAndComments } from '#/lib/hooks/subsocial/useGetAnswersFromReplies'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useCreateReply } from '#/services/subsocial/mutations'
import { useGetPost, useGetReplies } from '#/services/subsocial/queries'
import { PostWithSomeDetails } from '@subsocial/api/types'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { HTMLProps, useEffect, useState } from 'react'
import ReactionButtons from '../ReactionButtons'
import TagList from '../TagList'
import TransactionModal from '../TransactionModal'
import Comment from './Comment'
import CreatorOverview from './CreatorOverview'
import { createCommentForm } from './form/schema'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export interface PostDetailProps extends HTMLProps<HTMLDivElement> {
  post?: PostWithSomeDetails
  postId?: string
  shouldFetchPost?: boolean
  isLoading?: boolean
  withBorderBottom?: boolean
}

const REACTION_WIDTH = 50

export default function PostDetail({
  post,
  postId,
  shouldFetchPost = false,
  className,
  withBorderBottom,
  isLoading,
  ...props
}: PostDetailProps) {
  const {
    data: localPost,
    isLoading: localIsFetchingPost,
    isFetched,
  } = useGetPost(
    { postId: postId ?? '' },
    { enabled: !!postId && shouldFetchPost }
  )
  const { data: replies } = useGetReplies({ postId: post?.id })

  const { IntegratedSkeleton } = useIntegratedSkeleton(
    isLoading || localIsFetchingPost,
    shouldFetchPost ? isFetched : true
  )
  const [openCommentBox, setOpenCommentBox] = useState(false)
  const { getFieldData, handleSubmit, resetForm } = useFormikWrapper({
    ...createCommentForm,
    onSubmit: (values) => {
      if (!post?.id) return
      setOpenModal(true)
      createReply({
        body: values.body ?? '',
        rootPostId: post.id,
      })
    },
  })

  useEffect(() => {
    if (!openCommentBox) resetForm()
  }, [openCommentBox, resetForm])

  const [openModal, setOpenModal] = useState(false)
  const {
    mutate: createReply,
    isLoading: loadingCreatingReply,
    error: errorCreatingReply,
  } = useCreateReply({
    onSuccess: () => {
      resetForm()
      setOpenCommentBox(false)
    },
  })

  const { comments } = useFilterAnswersAndComments(replies)
  const usedPost = localPost ?? post

  return (
    <>
      <TransactionModal
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
        isLoading={loadingCreatingReply}
        action='Posting your reply'
        errorMsg={errorCreatingReply?.message}
      />
      <div
        className={clsx(
          'flex flex-col',
          withBorderBottom && 'border-b-2 border-bg-200 pb-4',
          className
        )}
        {...props}
      >
        <div className={clsx('flex', 'w-full')}>
          <div
            className={clsx('flex flex-col items-start', 'flex-shrink-0')}
            style={{ width: REACTION_WIDTH }}
          >
            <ReactionButtons
              upVoteCount={usedPost?.post?.struct?.upvotesCount}
              downVoteCount={usedPost?.post?.struct?.downvotesCount}
              postId={usedPost?.id}
              isLoading={isLoading}
            />
          </div>
          <div className={clsx('flex flex-col', 'flex-1')}>
            <div className={clsx('text-xl')}>
              <IntegratedSkeleton
                isLoading={isLoading}
                content={post?.post?.content?.title}
              >
                {(title) => <p className={clsx('mb-6')}>{title}</p>}
              </IntegratedSkeleton>
            </div>
            <div className={clsx('mb-4')}>
              <IntegratedSkeleton
                height={50}
                content={post?.post?.content?.body}
              >
                {(body) => (
                  <RichTextArea
                    containerClassName={clsx('text-sm')}
                    asReadOnlyContent={{ content: body }}
                    name='body'
                  />
                )}
              </IntegratedSkeleton>
            </div>
            <div className={clsx('flex justify-between items-end', 'mt-auto')}>
              <TagList
                tags={usedPost?.post?.content?.tags ?? []}
                isLoading={isLoading}
              />
              <CreatorOverview
                displayAskDate
                shouldFetchCreator
                isLoading={isLoading}
                createDate={usedPost?.post?.struct?.createdAtTime}
                creator={usedPost?.owner}
                creatorId={usedPost?.post.struct.createdByAccount}
              />
            </div>
          </div>
        </div>
        {comments.length > 0 && (
          <div
            className={clsx(
              'border-t-2 border-dashed border-bg-200',
              'pt-4 mt-8'
            )}
            style={{ marginLeft: REACTION_WIDTH }}
          >
            <div className={clsx('flex flex-col', 'space-y-4')}>
              {comments.map((comment) => (
                <Comment
                  className={clsx('text-sm')}
                  key={comment.id}
                  comment={comment}
                  commentId={comment.id}
                  shouldFetchComment
                />
              ))}
            </div>
          </div>
        )}
        <div
          style={{ marginLeft: REACTION_WIDTH }}
          className={clsx('text-sm', 'mt-4')}
        >
          <SkeletonFallback isLoading={isLoading} width={100}>
            {openCommentBox ? (
              <form className={clsx('flex flex-col')} onSubmit={handleSubmit}>
                <TextArea placeholder='Comment...' {...getFieldData('body')} />
                <div className={clsx('flex', 'mt-3 space-x-2')}>
                  <Button size='small' variant='outlined-brand'>
                    Submit
                  </Button>
                  <Button
                    size='small'
                    variant='unstyled'
                    type='button'
                    onClick={() => setOpenCommentBox(false)}
                    className={clsx('text-text-secondary')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Link variant='primary' onClick={() => setOpenCommentBox(true)}>
                Add a comment
              </Link>
            )}
          </SkeletonFallback>
        </div>
      </div>
    </>
  )
}
