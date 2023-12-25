import GuardUserOnly from '#/components/auth/GuardUserOnly'
import { ReactElement } from 'react'
import { CommonGuardProps, CommonGuardTypes } from './common/types'

export type GuardTypes = CommonGuardTypes | 'role'

export type GuardTypesProps =
  | ({ type: CommonGuardTypes } & Omit<CommonGuardProps, 'children'>)
  | { type: 'none' }

export default function GuardWrapper(
  props: GuardTypesProps & { children: any }
): ReactElement {
  if (props.type === 'user') {
    return <GuardUserOnly {...props} />
  } else {
    return props.children
  }
}
