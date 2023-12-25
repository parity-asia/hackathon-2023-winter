import { FormikConfig, FormikValues, useFormik } from 'formik'

export interface FieldData {
  error: string | undefined
}

const useFormikWrapper = <Values extends FormikValues = FormikValues>(
  data: FormikConfig<Values>
) => {
  const formik = useFormik(data)
  return {
    ...formik,
    getFieldData: (key: keyof Values, checkIsTouched = true) => {
      const { errors, touched, getFieldProps } = formik
      return {
        ...getFieldProps(key),
        error:
          !checkIsTouched || touched[key] ? (errors[key] as string) : undefined,
      }
    },
  }
}
export default useFormikWrapper
