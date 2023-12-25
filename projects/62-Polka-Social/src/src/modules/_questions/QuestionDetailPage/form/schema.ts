import { object, string } from 'yup'

export interface CreateAnswerFormType {
  body?: string
}
const createAnswerInitialValues: CreateAnswerFormType = {
  body: '',
}
export const createAnswerForm = {
  initialValues: createAnswerInitialValues,
  validationSchema: object().shape({
    body: string().test({
      name: 'answer-body-validator',
      test: function (value) {
        return (value?.length ?? 0) < 30
          ? this.createError({
              message: `Body text must be at least 30. Currently you have typed: ${
                value?.length ?? 0
              }`,
              path: 'body',
            })
          : true
      },
    }),
  }),
}
