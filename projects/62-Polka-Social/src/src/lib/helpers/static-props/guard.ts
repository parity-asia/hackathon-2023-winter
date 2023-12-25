import { GuardTypesProps } from '#/components/auth/GuardWrapper'

export type GuardParams = GuardTypesProps

export const getGuardProps = async (params: GuardParams) => {
  return { guard: params }
}
