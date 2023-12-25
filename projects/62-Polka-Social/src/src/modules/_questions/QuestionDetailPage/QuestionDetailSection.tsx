import Button from '#/components/Button'
import { useIntegratedSkeleton } from '#/components/SkeletonFallback'
import PostDetail from '#/containers/PostDetail'
import TransactionModal from '#/containers/TransactionModal'
import useFormikWrapper from '#/lib/hooks/useFormikWrapper'
import { useResetForm } from '#/lib/hooks/useResetForm'
import { useCreateReply } from '#/services/subsocial/mutations'
import { useGetPost, useGetReplies } from '#/services/subsocial/queries'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { createAnswerForm } from './form/schema'

const RichTextArea = dynamic(() => import('#/components/inputs/RichTextArea'), {
  ssr: false,
})

export default function QuestionDetailSection() {
  const { query } = useRouter()
  const id = (query['id'] ?? '') as string
  const { data: question, isLoading, isFetched } = useGetPost({ postId: id })
  const { loadingChecker } = useIntegratedSkeleton(isLoading, isFetched)

  const {
    data: replies,
    isLoading: isLoadingReplies,
    isFetched: isFetchedReplies,
  } = useGetReplies({ postId: id })
  const { loadingChecker: loadingCheckerReplies } = useIntegratedSkeleton(
    isLoadingReplies,
    isFetchedReplies
  )

  const [isOpenTxModal, setIsOpenTxModal] = useState(false)
  const { getFieldData, handleSubmit, resetForm } = useFormikWrapper({
    ...createAnswerForm,
    onSubmit: (values) => {
      setIsOpenTxModal(true)
      createAnswer({
        body: values.body ?? '',
        rootPostId: id,
        isAnswer: true,
      })
    },
  })
  const storagePrefix = `answer-${id}`
  const { key, resetFormData } = useResetForm({
    resetForm,
    ...getFieldData('body'),
    storagePrefix,
  })
  const {
    mutate: createAnswer,
    isLoading: creatingAnswer,
    error: errorCreatingAnswer,
  } = useCreateReply({
    onSuccess: resetFormData,
  })

  const answers = useMemo(() => {
    return replies?.filter((reply) => (reply?.post?.content as any)?.isAnswer)
  }, [replies])

  return (
    <div className={clsx('pb-32')}>
      <TransactionModal
        isLoading={creatingAnswer}
        isOpen={isOpenTxModal}
        handleClose={() => setIsOpenTxModal(false)}
        action='Submitting answer'
        errorMsg={errorCreatingAnswer?.message}
      />
      <PostDetail
        shouldFetchPost
        postId={id}
        post={question}
        withBorderBottom
        isLoading={loadingChecker(question)}
      />
      <div className={clsx('flex flex-col', 'space-y-8')}>
        <p className={clsx('text-xl font-bold', 'mt-4')}>
          {answers?.length ?? 0} Answers
        </p>
        {answers?.map((reply) => (
          <PostDetail
            shouldFetchPost
            postId={reply?.id}
            key={reply.id}
            post={reply}
            withBorderBottom
            isLoading={loadingCheckerReplies(reply)}
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className={clsx('flex flex-col', 'mt-8', 'text-sm')}
      >
        <p className={clsx('text-xl font-bold', 'mb-1')}>Your Answer</p>
        <p className={clsx('text-sm text-text-secondary', 'mb-4')}>
          Please be sure to answer the question. Provide details and share your
          research!
        </p>
        <RichTextArea
          key={key}
          {...getFieldData('body')}
          storagePrefix={storagePrefix}
        />
        <div className={clsx('flex', 'mt-6')}>
          <Button>Post your answer</Button>
        </div>
      </form>
    </div>
  )
}
