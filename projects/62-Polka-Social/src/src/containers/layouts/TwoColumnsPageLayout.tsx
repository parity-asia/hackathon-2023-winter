import { SCREEN_HEIGHT_WITHOUT_NAVBAR } from '#/lib/constants/style'
import clsx from 'clsx'

const sizes = {
  small: clsx('max-w-[18rem]'),
  xs: clsx('max-w-[15rem]'),
}

export interface TwoColumnsPageLayoutProps {
  leftSection: JSX.Element
  rightSection: JSX.Element
  rightSectionSize?: keyof typeof sizes
}

export default function TwoColumnsPageLayout({
  leftSection,
  rightSection,
  rightSectionSize = 'small',
}: TwoColumnsPageLayoutProps) {
  return (
    <div className={clsx('flex items-stretch flex-1')}>
      <div className={clsx('flex flex-col', 'w-full', 'pr-6')}>
        {leftSection}
      </div>
      <div
        className={clsx(
          'flex-shrink w-full',
          'px-6 ml-auto',
          'border-l-4 border-bg-100',
          sizes[rightSectionSize]
        )}
      >
        <div
          className={clsx('sticky top-8')}
          style={{ height: SCREEN_HEIGHT_WITHOUT_NAVBAR }}
        >
          {rightSection}
        </div>
      </div>
    </div>
  )
}
