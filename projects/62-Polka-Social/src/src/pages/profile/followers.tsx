import getCommonStaticProps from '#/lib/helpers/static-props'
import FollowersPage from '#/modules/_profile/FollowersPage'

export const getStaticProps = getCommonStaticProps({ guard: { type: 'user' } })
export default FollowersPage
