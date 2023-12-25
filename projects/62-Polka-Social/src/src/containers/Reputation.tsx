import { HTMLProps } from 'react'

export interface ReputationProps extends HTMLProps<HTMLDivElement> {
  address: string
}

export default function Reputation(_props: ReputationProps) {
  return null
  // const { data, isLoading, isFetched } = useGetReputationByAddress(
  //   encodeAddress(address)
  // )
  // const { loadingChecker, getContent } = useIntegratedSkeleton(
  //   isLoading,
  //   isFetched
  // )

  // const reputation = data?.reputation?.value

  // return (
  //   <div className={clsx('flex items-center', className)} {...props}>
  //     <SkeletonFallback isLoading={loadingChecker(reputation)} width={50}>
  //       <BsAward className='mr-1' />
  //       <span>{getContent(reputation, 0)}</span>
  //     </SkeletonFallback>
  //   </div>
  // )
}
