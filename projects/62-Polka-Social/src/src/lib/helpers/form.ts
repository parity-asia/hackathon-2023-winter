import { ChangeEventHandler, FormEventHandler } from 'react'

export const onChangeWrapper = (
  onChange: ChangeEventHandler | FormEventHandler | undefined,
  content: any,
  name: string
) => {
  onChange &&
    onChange({
      target: {
        name: name,
        value: content,
      },
    } as any)
}
