import clsx from 'clsx'
import { HTMLProps } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'

export type TextAreaProps = HTMLProps<HTMLTextAreaElement> &
  RequiredFieldWrapperProps

export default function TextArea(props: TextAreaProps) {
  return (
    <FieldWrapper {...props}>
      {(id, commonClassNames) => (
        <div className={clsx('grid')}>
          <textarea
            {...getCleanedInputProps(props)}
            id={id}
            className={clsx(
              commonClassNames,
              props?.className,
              'overflow-hidden'
            )}
            style={{
              ...props.style,
              resize: 'none',
              gridArea: '1 / 1 / 2 / 2',
            }}
          />
          <div
            className={clsx(
              'whitespace-pre-wrap',
              commonClassNames,
              props?.className
            )}
            style={{
              ...props.style,
              visibility: 'hidden',
              gridArea: '1 / 1 / 2 / 2',
            }}
          >
            {props.value}{' '}
          </div>
        </div>
      )}
    </FieldWrapper>
  )
}
