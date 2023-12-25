import { OptionType } from '#/components/inputs/Select/Select'
import { array, object, string } from 'yup'

export interface AskQuestionFormType {
  title: string
  body: string
  tags: OptionType[]
}
const askQuestionInitialValues: AskQuestionFormType = {
  title: '',
  body: '',
  tags: [],
}
export const askQuestionForm = {
  initialValues: askQuestionInitialValues,
  validationSchema: object().shape({
    title: string().required('You need to provide the title of your question!'),
    body: string().test({
      name: 'question-body-validator',
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
    tags: array().min(1, 'You have to choose at least a single tag'),
  }),
}
