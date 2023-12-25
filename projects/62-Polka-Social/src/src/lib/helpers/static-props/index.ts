import { GetStaticProps, GetStaticPropsContext } from 'next'
import { getGuardProps, GuardParams } from './guard'

type ReturnedPropsType<T extends (...args: any) => any> = Partial<
  Awaited<ReturnType<T>>
>

interface CommonStaticPropsParams {
  guard?: GuardParams
}
const staticPropTypes: (keyof CommonStaticPropsParams)[] = ['guard']
export type CommonStaticProps = ReturnedPropsType<typeof getGuardProps>

function getPropsGeneratorFunction(key: keyof CommonStaticPropsParams) {
  let getProps
  switch (key) {
    case 'guard':
      getProps = getGuardProps
      break
  }
  return getProps
}

function getPropsGenerator(_context: GetStaticPropsContext) {
  return async function (
    key: keyof CommonStaticPropsParams,
    params: CommonStaticPropsParams
  ) {
    const currentParam = params[key]

    const getProps = getPropsGeneratorFunction(key)
    if (getProps && currentParam) {
      return getProps(currentParam as any)
    }
    return {}
  }
}

export default function getCommonStaticProps(
  params: CommonStaticPropsParams
): GetStaticProps {
  return async (context) => {
    const getProps = getPropsGenerator(context)
    const commonProps = await Promise.all(
      staticPropTypes.map((key) => {
        return getProps(key as any, params)
      })
    )
    return {
      props: commonProps.reduce((acc, props) => ({ ...acc, ...props }), {}),
    }
  }
}
