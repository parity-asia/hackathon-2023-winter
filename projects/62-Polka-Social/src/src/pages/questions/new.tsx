import NewQuestionsPage from '#/modules/_questions/QuestionListPage'
export function getStaticProps() {
  return {
    props: {
      type: 'new',
    },
  }
}
export default NewQuestionsPage
