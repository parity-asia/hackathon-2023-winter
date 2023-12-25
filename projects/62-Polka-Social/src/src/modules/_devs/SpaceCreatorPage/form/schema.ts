import {
  COMMON_MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_FORMAT,
} from '#/lib/constants/file'
import { mixed, object, string } from 'yup'

export interface CreateSpaceFormType {
  name: string
  desc?: string
  avatar?: File
}
const createSpaceInitialValues: CreateSpaceFormType = {
  name: '',
  desc: '',
  avatar: undefined,
}
export const createSpaceForm = {
  initialValues: createSpaceInitialValues,
  validationSchema: object().shape({
    name: string().required('Your space needs a name!'),
    desc: string(),
    avatar: mixed()
      .required()
      .test(
        'fileSize',
        'File Size is too large',
        (value) => value?.size <= COMMON_MAX_IMAGE_SIZE
      )
      .test('fileType', 'Unsupported File Format', (value) =>
        SUPPORTED_IMAGE_FORMAT.includes(value?.type)
      ),
  }),
}
