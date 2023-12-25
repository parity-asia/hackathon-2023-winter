import { Descendant } from 'slate'

export function serializeDraft(draft: Descendant[]) {
  return JSON.stringify(draft)
}

export function deserializeDraft(text: string) {
  return JSON.parse(text)
}
