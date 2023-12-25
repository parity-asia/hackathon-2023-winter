import clsx from 'clsx'
import { BsCash } from 'react-icons/bs'

export default function HomePage() {
  const highlightedTextClassNames = clsx('text-brand font-bold')
  const paragraphClassNames = clsx('max-w-[60ch] mb-4 leading-loose')

  return (
    <div className='pl-8'>
      <h1 className='text-2xl font-bold mb-8'>
        Welcome to Substrate Stack<span className='text-brand'>Exchange</span>!
      </h1>
      <p className={paragraphClassNames}>
        <span className='text-text-secondary'>
          Need a help when building innovations with Substrate SDK?
        </span>
        <br />
        <span className={highlightedTextClassNames}>Search</span> for it or{' '}
        <span className={highlightedTextClassNames}>Ask it yourself</span> here
      </p>
      <p className={paragraphClassNames}>
        <span className='text-text-secondary'>
          Found an answer that you are looking for?
        </span>
        <br />
        Consider <span className={highlightedTextClassNames}>tipping</span> the
        helpful user <BsCash className='inline text-brand' />
      </p>
    </div>
  )
}
