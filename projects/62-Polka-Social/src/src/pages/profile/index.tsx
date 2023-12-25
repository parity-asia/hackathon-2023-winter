import getCommonStaticProps from '#/lib/helpers/static-props'
import ProfilePage from '#/modules/_profile/ProfilePage'

export const getStaticProps = getCommonStaticProps({
  guard: { type: 'user' },
})
export default ProfilePage
