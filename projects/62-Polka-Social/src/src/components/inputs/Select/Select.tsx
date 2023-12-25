import { hoverRingClassName } from '#/lib/constants/common-classnames'
import { onChangeWrapper } from '#/lib/helpers/form'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { forwardRef, HTMLProps } from 'react'
import { GroupBase } from 'react-select'
import { CreatableProps } from 'react-select/creatable'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from '../common/FieldWrapper'
import { customSelectStyles } from './helpers/styles'

const Creatable = dynamic(() => import('react-select/creatable'))
const UsualSelect = dynamic(() => import('react-select'))

export type OptionType = {
  value: string
  label?: any
}

type ParentProps<IsMulti extends boolean> = CreatableProps<
  OptionType,
  IsMulti,
  GroupBase<OptionType>
> &
  RequiredFieldWrapperProps

export interface SelectProps<IsMulti extends boolean>
  extends Omit<ParentProps<IsMulti>, 'onChange'> {
  value: OptionType
  onChange?: HTMLProps<HTMLSelectElement>['onChange']
  creatable?: boolean
}

const Select = forwardRef(function Select<IsMulti extends boolean = false>(
  { creatable = false, ...props }: SelectProps<IsMulti>,
  ref: any
) {
  const className = clsx(
    'bg-bg-200',
    'py-2 pl-4 pr-1',
    'rounded-md',
    'transition duration-150',
    'disabled:cursor-not-allowed disabled:brightness-75',
    hoverRingClassName
  )
  const errorClassNames = clsx('ring-2 ring-red-500 ring-offset-2')
  const inputClassNames = clsx(className, props.error && errorClassNames)

  const Component = creatable ? Creatable : UsualSelect

  return (
    <FieldWrapper {...props}>
      {(id) => (
        <Component
          {...(getCleanedInputProps(props) as any)}
          ref={ref}
          styles={customSelectStyles(props) as any}
          onChange={(value) => {
            onChangeWrapper(props.onChange, value, props.name ?? '')
          }}
          instanceId={id}
          className={clsx(inputClassNames, props?.className)}
        />
      )}
    </FieldWrapper>
  )
})
export default Select
