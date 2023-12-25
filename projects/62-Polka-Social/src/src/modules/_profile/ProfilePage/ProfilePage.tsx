import Button from '#/components/Button'
import Link from '#/components/Link'
import TwoColumnsPageLayout from '#/containers/layouts/TwoColumnsPageLayout'
import QuestionList from '#/containers/QuestionList'
import { isValidAddress } from '#/lib/helpers/chain'
import { useGetProfile } from '#/services/subsocial/queries'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import ProfileSection from './ProfileSection'

export default function ProfilePage() {
  const router = useRouter()
  const { query } = router
  const userId = query.id as string
  const { data: profile } = useGetProfile({ address: userId })

  const isValidUserId = useMemo(() => {
    return userId ? isValidAddress(userId) : true
  }, [userId])

  if (!isValidUserId) {
    return (
      <div className='flex flex-col items-center'>
        <h1 className={clsx('text-2xl', 'mb-2')}>
          Account <strong>{userId}</strong> is does not exist
        </h1>
        <p className={clsx('text-text-secondary text-sm', 'mb-6')}>
          Please recheck the address you entered.
        </p>
        <Link href='/'>
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  const profileName = profile?.content?.name ?? truncateMiddle(userId)

  return (
    <TwoColumnsPageLayout
      leftSection={
        <QuestionList
          title={!userId ? 'Your Questions' : `${profileName} Questions`}
          type={userId ? 'other-user' : 'user'}
          otherUserAddress={userId}
          className={clsx('pb-20')}
          noQuestionNotice='You have not asked any question.'
          noQuestionNoticeSubtitleWithButton='Do you have a question that you want to ask?'
        />
      }
      rightSection={<ProfileSection />}
    />
  )
}
