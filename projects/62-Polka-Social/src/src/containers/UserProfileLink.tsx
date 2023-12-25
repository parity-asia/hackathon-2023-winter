import AspectRatioContainer from '#/components/AspectRatioContainer'
import ImageContainer from '#/components/ImageContainer'
import Link, { LinkProps } from '#/components/Link'
import SkeletonFallback from '#/components/SkeletonFallback'
import { DEFAULT_PROFILE_PIC } from '#/lib/constants/file'
import { getImageUrlFromIPFS } from '#/lib/helpers/image-url-generator'
import useIsCurrentUser from '#/lib/hooks/isCurrentUser'
import { useGetProfile } from '#/services/subsocial/queries'
import { SpaceData } from '@subsocial/api/types'
import { truncateMiddle } from '@talisman-connect/ui'
import clsx from 'clsx'

export interface UserProfileLinkProps extends LinkProps {
  isLoading?: boolean
  profile?: SpaceData
  profileId?: string
}

export default function UserProfileLink({
  className,
  profileId,
  isLoading,
  profile,
  ...props
}: UserProfileLinkProps) {
  const { data: localProfile, isLoading: localIsLoading } = useGetProfile({
    address: profileId,
  })
  const usedProfile = profile || localProfile
  const usedIsLoading = isLoading || localIsLoading

  const isCurrentUser = useIsCurrentUser(profileId)

  return (
    <Link
      variant='primary'
      className={clsx('flex items-center', className)}
      href={`/profile/${isCurrentUser ? '' : profileId}`}
      {...props}
    >
      <div className={clsx('w-5 h-5', 'mr-2', 'relative top-px')}>
        <AspectRatioContainer aspectRatio='1:1'>
          <SkeletonFallback
            isLoading={usedIsLoading}
            circle
            height='100%'
            className='block'
          >
            <ImageContainer
              aspectRatio='1:1'
              className='rounded-full'
              src={
                usedProfile?.content?.image
                  ? getImageUrlFromIPFS(usedProfile.content.image)
                  : DEFAULT_PROFILE_PIC
              }
              alt='profile'
            />
          </SkeletonFallback>
        </AspectRatioContainer>
      </div>
      <SkeletonFallback isLoading={usedIsLoading} width={75}>
        <p className='font-bold'>
          {isCurrentUser
            ? 'You'
            : usedProfile?.content?.name ?? truncateMiddle(profileId)}
        </p>
      </SkeletonFallback>
    </Link>
  )
}
