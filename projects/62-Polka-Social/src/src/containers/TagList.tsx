import Chip from '#/components/Chip'
import Link from '#/components/Link'
import SkeletonFallback from '#/components/SkeletonFallback'
import clsx from 'clsx'
import { HTMLProps } from 'react'

const sizes = {
  small: clsx('text-xs'),
  medium: clsx('text-sm'),
  large: clsx('text-base'),
}

export interface TagListProps extends HTMLProps<HTMLDivElement> {
  tags: string[]
  isLoading?: boolean
  skeletonWidth?: number
  tagSize?: keyof typeof sizes
}

export default function TagList({
  tags,
  isLoading,
  className,
  skeletonWidth = 100,
  tagSize = 'small',
  ...props
}: TagListProps) {
  return (
    <SkeletonFallback isLoading={isLoading} width={skeletonWidth}>
      <div
        className={clsx('flex flex-wrap space-x-2', sizes[tagSize], className)}
        {...props}
      >
        {tags.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Chip>{tag}</Chip>
          </Link>
        ))}
      </div>
    </SkeletonFallback>
  )
}
