import { mixed, object, string } from 'yup'

export interface EditProfileFormType {
  name: string
  about?: string
  avatar?: File | string
}
const editProfileInitialValues: EditProfileFormType = {
  name: '',
  about: '',
  avatar: undefined,
}
export const editProfileForm = {
  initialValues: editProfileInitialValues,
  validationSchema: object().shape({
    name: string(),
    about: string(),
    avatar: mixed().nullable(),
  }),
}
