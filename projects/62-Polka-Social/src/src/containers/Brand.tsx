import BrandImage from '#/assets/brand.png'
import ImageContainer from '#/components/ImageContainer'
import clsx from 'clsx'
import { HTMLProps } from 'react'

export default function Brand({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return (
    <div className={clsx('flex items-center', className)} {...props}>
      <div className={clsx('w-10')}>
        <ImageContainer src={BrandImage} alt='brand' />
      </div>
      <p className='font-bold ml-2'>
        <span>Stack</span>
        <span className='text-brand'>Exchange</span>
      </p>
    </div>
  )
}
