import QuestionList, { QuestionListFilters } from '#/containers/QuestionList'
import clsx from 'clsx'

interface Props {
  type: QuestionListFilters
}
const titles: { [key in QuestionListFilters]?: string } = {
  new: 'New Questions',
  unanswered: 'Unanswered Questions',
}

export default function QuestionListPage({ type }: Props) {
  return (
    <QuestionList title={titles[type]} type={type} className={clsx('pb-20')} />
  )
}
