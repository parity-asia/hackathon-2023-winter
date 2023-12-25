import { hoverRingClassName } from '#/lib/constants/common-classnames'
import clsx from 'clsx'
import { useId } from 'react'

export interface RequiredFieldWrapperProps {
  containerClassName?: string
  inputParentClassName?: string
  fullWidth?: boolean

  label?: string
  labelClassName?: string
  helperText?: string
  helperTextClassName?: string
  rightElement?: (classNames: string) => JSX.Element
  helperTextOnRightOfLabel?: string
  helperTextOnRightOfLabelClassNames?: string

  error?: string | boolean
  required?: boolean

  id?: string
}

export interface FieldWrapperProps extends RequiredFieldWrapperProps {
  children: (id: string, commonClassNames: string) => JSX.Element
}

export default function FieldWrapper({
  containerClassName,
  inputParentClassName,
  label,
  labelClassName,
  helperText,
  helperTextClassName,
  fullWidth = true,
  id,
  error,
  required,
  rightElement,
  helperTextOnRightOfLabel,
  helperTextOnRightOfLabelClassNames,
  children,
}: FieldWrapperProps) {
  const generatedId = useId()
  const usedId = id || generatedId

  const commonClassNames = clsx(
    'bg-bg-200',
    'py-2 pl-4 pr-9',
    'rounded-md',
    'transition duration-150',
    'hover:brightness-125',
    'focus:brightness-125',
    'disabled:cursor-not-allowed disabled:brightness-75',
    hoverRingClassName
  )
  const errorClassNames = clsx('ring-2 ring-red-500 ring-offset-2')
  const inputClassNames = clsx(commonClassNames, error && errorClassNames)

  const rightElementClassNames = clsx(
    'absolute',
    'right-2',
    'top-1/2 -translate-y-1/2'
  )

  const hasErrorMessage = error && typeof error === 'string'

  return (
    <div
      className={clsx(
        'flex flex-col',
        fullWidth && 'w-full',
        'space-y-2',
        containerClassName
      )}
    >
      {label && (
        <div
          className={clsx(
            'mb-0.5 flex items-end justify-between',
            labelClassName
          )}
        >
          <label htmlFor={usedId}>
            {label}
            {required && <span className='text-red-500'> *</span>}
          </label>
          <p
            className={clsx(
              'text-text-secondary',
              helperTextOnRightOfLabelClassNames
            )}
          >
            {helperTextOnRightOfLabel}
          </p>
        </div>
      )}
      <div
        className={clsx('relative w-full flex flex-col', inputParentClassName)}
      >
        {children(usedId, inputClassNames)}
        {rightElement && rightElement(rightElementClassNames)}
      </div>
      {(helperText || hasErrorMessage) && (
        <p
          className={clsx(
            'text-sm text-text-secondary',
            hasErrorMessage && '!text-red-500',
            helperTextClassName
          )}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}

export function getCleanedInputProps<T extends RequiredFieldWrapperProps>(
  props: T
) {
  const {
    containerClassName: _containerProps,
    label: _label,
    labelClassName: _labelProps,
    error: _error,
    fullWidth: _fullWidth,
    helperText: _helperText,
    helperTextClassName: _helperTextProps,
    id: _id,
    helperTextOnRightOfLabel: _helperTextOnRightOfLabel,
    helperTextOnRightOfLabelClassNames: _helperTextOnRightOfLabelClassNames,
    rightElement: _rightElement,
    ...otherProps
  } = props

  return otherProps
}
