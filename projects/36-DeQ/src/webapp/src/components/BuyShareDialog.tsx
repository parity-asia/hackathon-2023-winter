'use client';

import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  Typography,
  Spinner,
  Button,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Input,
} from '@material-tailwind/react'
import { formatEther, parseAbi } from 'viem'
import { usePublicClient, useAccount, useConnect, useContractWrite, usePrepareContractWrite, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { getBuyPrice, type EstimatedPrice, ANSWER_CONTRACT_ADDRESS, abis } from '@/features/answers/requests'
import { mandala } from '@/utils/chains'
import { buyAnswerIdAtom } from './atoms';


export function BuyShareDialog({ id }: { id: number }) {
  const [isEstimating, setIsEstimating] = useState(false)
  const [amount, setAmount] = useState(0)
  const [price, setPrice] = useState<EstimatedPrice | null>(null)

  const [buyAnswerId, setBuyAnswerId] = useAtom(buyAnswerIdAtom)
  const publicClient = usePublicClient()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { isConnected } = useAccount()

  const { chain } = useNetwork()
  // const { switchNetwork } = useSwitchNetwork({ chainId: polygonMumbai.id })
  // const needSwitchChain = chain?.id !== polygonMumbai.id
  const { switchNetwork } = useSwitchNetwork({ chainId: mandala.id })
  const needSwitchChain = chain?.id !== mandala.id

  const { config } = usePrepareContractWrite({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'buy',
    args: [BigInt(id), BigInt(amount * 10000) * BigInt(1e14)],
    value: price?.priceWithFee,
    // value: BigInt(1e17),
    enabled: !!(amount && amount > 0 && price && price.priceWithFee > 0 && isConnected),
  })
  const { isLoading, write, } = useContractWrite({
    ...config,
    onSuccess: () => setBuyAnswerId(null),
  })

  return (
    <>
      <DialogHeader>
        <Typography variant="h5">Buy Shares</Typography>
      </DialogHeader>
      <DialogBody>
        {isEstimating ? (<Spinner />) : (
          price ? (
            <Typography className="text-2xl text-red-400 font-medium">
              {formatEther(price.price)} <small>ACA</small>
            </Typography>
          ) : null
        )}
        <Typography className="mb-4">
          Price rises as more shares are bought.
        </Typography>
        <div className="relative flex w-full">
          <Input
            label="Shares"
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
            onChange={e => {
              const parsed = Number(e.target.value)
              if (parsed && parsed > 0 && !isNaN(parsed)) {
                setAmount(parsed)
                setIsEstimating(true)
                getBuyPrice(publicClient, BigInt(id), BigInt(parsed * 10000) * BigInt(1e14)).then(price => {
                  setPrice(price)
                  setIsEstimating(false)
                })
              }
            }}
          />
          <Button
            size="sm"
            color="gray"
            disabled={true}
            className="!absolute right-1 top-1 rounded"
          >
            Shares
          </Button>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => setBuyAnswerId(null)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        {!isConnected ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => connect()}
          >
            <span>Connect</span>
          </Button>
        ) : null}
        {(isConnected && needSwitchChain) ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => {
              switchNetwork?.()
            }}
          >
            <span>Switch Network</span>
          </Button>
        ) : null}
        <Button
          variant="gradient"
          color="amber"
          loading={isLoading}
          disabled={isEstimating || !amount || !isConnected}
          onClick={() => write?.()}
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </>
  )
}
