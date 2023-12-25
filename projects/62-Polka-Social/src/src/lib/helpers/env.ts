function checkEnv(
  data: string | undefined,
  envName: string,
  throwError = false
) {
  if (data === undefined && throwError) {
    throw new Error(`env ${envName} is not set`)
  }
  return data as string
}

export function getUseTestnet() {
  const useTestnet = checkEnv(
    process.env['NEXT_PUBLIC_USE_TESTNET'],
    'NEXT_PUBLIC_USE_TESTNET'
  )
  return useTestnet === 'true'
}

export function getSpaceId(): string {
  return checkEnv(
    process.env['NEXT_PUBLIC_SPACE_ID'],
    'NEXT_PUBLIC_SPACE_ID',
    true
  )
}

export function getAddressPrefix() {
  return Number.parseInt(
    checkEnv(
      process.env['NEXT_PUBLIC_ADDRESS_PREFIX'],
      'NEXT_PUBLIC_ADDRESS_PREFIX',
      false
    ) ?? '28'
  )
}

export function getIndexingService() {
  return checkEnv(
    process.env['NEXT_PUBLIC_INDEXING_SERVICE'],
    'NEXT_PUBLIC_INDEXING_SERVICE',
    false
  )
}
