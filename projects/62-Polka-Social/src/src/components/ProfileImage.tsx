import { DEFAULT_PROFILE_PIC } from '#/lib/constants/file'
import clsx from 'clsx'
import { ImageProps } from 'next/image'
import { HTMLProps } from 'react'
import AspectRatioContainer from './AspectRatioContainer'
import ImageContainer from './ImageContainer'
import SkeletonFallback from './SkeletonFallback'

export interface ProfileImageProps
  extends Omit<HTMLProps<HTMLDivElement>, 'src'> {
  src?: ImageProps['src']
  alt?: string
  isLoading?: boolean
}

export default function ProfileImage({
  className,
  src,
  alt,
  isLoading,
  ...props
}: ProfileImageProps) {
  return (
    <div className={clsx(className)} {...props}>
      <AspectRatioContainer className={clsx(className)} aspectRatio='1:1'>
        <SkeletonFallback
          isLoading={isLoading}
          circle
          height='100%'
          className='block'
        >
          <ImageContainer
            src={src ?? DEFAULT_PROFILE_PIC}
            className={clsx('rounded-full')}
            aspectRatio='1:1'
            alt={alt ?? 'Profile'}
          />
        </SkeletonFallback>
      </AspectRatioContainer>
    </div>
  )
}
