import { ReactionType } from '@subsocial/api/types'
import clsx from 'clsx'
import { IconType } from 'react-icons'
import { BsTriangle, BsTriangleFill } from 'react-icons/bs'

type IconTypeParams = Parameters<IconType>
type IconTypeProps = IconTypeParams[0]

export interface ReactionArrowIconProps extends IconTypeProps {
  type: ReactionType
  isActive?: boolean
}

export default function ReactionArrowIcon({
  type,
  isActive,
  className,
  ...props
}: ReactionArrowIconProps) {
  const buttonClassNames = clsx(type === 'Downvote' && 'rotate-180', className)
  return isActive ? (
    <BsTriangleFill className={buttonClassNames} {...props} />
  ) : (
    <BsTriangle className={buttonClassNames} {...props} />
  )
}
