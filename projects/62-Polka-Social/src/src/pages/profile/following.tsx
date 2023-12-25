import getCommonStaticProps from '#/lib/helpers/static-props'
import FollowingPage from '#/modules/_profile/FollowingPage'

export const getStaticProps = getCommonStaticProps({ guard: { type: 'user' } })
export default FollowingPage
