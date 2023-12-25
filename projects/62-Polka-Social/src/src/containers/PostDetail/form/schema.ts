import { object, string } from 'yup'

export interface CreateCommentFormType {
  body?: string
}
const createCommentInitialValues: CreateCommentFormType = {
  body: '',
}
export const createCommentForm = {
  initialValues: createCommentInitialValues,
  validationSchema: object().shape({
    body: string().required().min(10),
  }),
}
