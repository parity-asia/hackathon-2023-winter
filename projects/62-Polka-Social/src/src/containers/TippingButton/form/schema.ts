import { OptionType } from '#/components/inputs/Select/Select'
import { mixed, number, object } from 'yup'

export interface TippingFormType {
  amount: number
  network: OptionType | null
}
const tippingFormInitialValues: TippingFormType = {
  amount: 0,
  network: null,
}
export const tippingForm = {
  initialValues: tippingFormInitialValues,
  validationSchema: object().shape({
    amount: number().moreThan(0),
    network: mixed().test({
      name: 'network-validator',
      test: function (value) {
        return !value
          ? this.createError({
              message: 'Token must be selected',
              path: 'network',
            })
          : true
      },
    }),
  }),
}
