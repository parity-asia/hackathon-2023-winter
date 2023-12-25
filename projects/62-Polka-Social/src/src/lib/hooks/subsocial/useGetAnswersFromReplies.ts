import { PostWithSomeDetails } from '@subsocial/api/types'
import { useMemo } from 'react'

export function useFilterAnswersAndComments(replies?: PostWithSomeDetails[]) {
  return useMemo(() => {
    const answers: PostWithSomeDetails[] = []
    const comments: PostWithSomeDetails[] = []
    replies?.forEach((reply) => {
      if ((reply.post.content as any).isAnswer) {
        answers.push(reply)
      } else {
        comments.push(reply)
      }
    })
    return {
      answers,
      comments,
    }
  }, [replies])
}
