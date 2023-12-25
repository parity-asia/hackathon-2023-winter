import getCommonStaticProps from '#/lib/helpers/static-props'
import EditProfilePage from '#/modules/_profile/EditProfilePage'

export const getStaticProps = getCommonStaticProps({ guard: { type: 'user' } })
export default EditProfilePage
