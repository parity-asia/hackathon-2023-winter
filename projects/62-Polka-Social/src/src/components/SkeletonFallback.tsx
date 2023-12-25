import { generateLoadingChecker } from '#/lib/helpers/renderer'
import clsx from 'clsx'
import { useMemo } from 'react'
import Skeleton, { SkeletonProps } from 'react-loading-skeleton'

const colors = {
  default: {
    baseColor: '#505050',
    highlightColor: '#606060',
  },
  brand: {
    baseColor: '#1fad71',
    highlightColor: '#26d98e',
  },
}

export interface SkeletonFallbackProps extends SkeletonProps {
  isLoading?: boolean
  children: any
  color?: keyof typeof colors
}

export default function SkeletonFallback({
  isLoading,
  children,
  className,
  color = 'default',
  ...props
}: SkeletonFallbackProps) {
  return isLoading === false || (isLoading === undefined && children) ? (
    children
  ) : (
    <Skeleton {...colors[color]} className={clsx(className)} {...props} />
  )
}

export interface IntegratedSkeletonProps<T>
  extends Omit<SkeletonFallbackProps, 'children'> {
  content: T | null | undefined
  defaultContent?: any
  children?: (content: T) => JSX.Element | string | number
}

export function useIntegratedSkeleton(
  ...data: Parameters<typeof generateLoadingChecker>
) {
  return useMemo(() => {
    const { loadingChecker, getContent } = generateLoadingChecker(...data)
    return {
      IntegratedSkeleton: function IntegratedSkeleton<T>({
        content,
        defaultContent,
        children,
        ...props
      }: IntegratedSkeletonProps<T>) {
        const shouldRenderDefaultContent = loadingChecker(content) || !content
        return (
          <SkeletonFallback {...props} isLoading={loadingChecker(content)}>
            {(() => {
              if (shouldRenderDefaultContent) {
                return defaultContent
              } else if (children) {
                return children(content)
              } else {
                return content
              }
            })()}
          </SkeletonFallback>
        )
      },
      loadingChecker,
      getContent,
    }
  }, [data])
}
