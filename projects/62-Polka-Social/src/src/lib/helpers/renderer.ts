import { isValidElement } from 'react'

export function generateLoadingChecker(isLoading: boolean, isFetched = true) {
  const loadingChecker = (content: any) =>
    !!(isLoading || (!content && !isFetched))
  return {
    loadingChecker,
    getContent: <Content, Default>(content: Content, defaultContent: Default) =>
      loadingChecker(content) || !content ? defaultContent : content,
  }
}

export function renderElementOrCustom<T>(
  data: JSX.Element | T,
  custom?: (data: T) => JSX.Element | T
) {
  const builder = custom || ((data_: T) => data_)
  return isValidElement(data) ? data : builder(data as T)
}
