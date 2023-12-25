declare module '*.gql' {
  import { DocumentNode } from 'gql'
  const Schema: DocumentNode

  export = Schema
}
