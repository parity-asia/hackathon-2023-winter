import GuardWrapper from '#/components/auth/GuardWrapper'
import Container from '#/components/Container'
import Navbar from '#/containers/Navbar'
import Sidebar from '#/containers/Sidebar'
import { SubsocialApiContextProvider } from '#/contexts/SubsocialApiContext'
import { WalletContextProvider } from '#/contexts/WalletContext'
import { NAVBAR_HEIGHT } from '#/lib/constants/style'
import { CommonStaticProps } from '#/lib/helpers/static-props'
import queryClient from '#/services/client'
import '@talisman-connect/components/talisman-connect-components.esm.css'
import '@talisman-connect/ui/talisman-connect-ui.esm.css'
import clsx from 'clsx'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import 'react-loading-skeleton/dist/skeleton.css'
import { QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const { guard = { type: 'none' } } = pageProps as CommonStaticProps
  return (
    <CommonProvidersWrapper>
      <NextNProgress />
      <ToastContainer position='top-left' theme='dark' />
      <Navbar height={NAVBAR_HEIGHT} />
      <Container
        style={{ marginTop: NAVBAR_HEIGHT }}
        className={clsx('relative')}
      >
        <div className={clsx('flex items-stretch', 'w-full pt-4')}>
          <Sidebar
            className={clsx('sticky top-8')}
            style={{
              height: `calc(100vh - ${NAVBAR_HEIGHT + 48}px)`,
            }}
          />
          <main className={clsx('flex flex-col flex-1', 'ml-12')}>
            <GuardWrapper {...guard}>
              <Component {...pageProps} />
            </GuardWrapper>
          </main>
        </div>
      </Container>
    </CommonProvidersWrapper>
  )
}

function CommonProvidersWrapper({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>
        <SubsocialApiContextProvider>{children}</SubsocialApiContextProvider>
      </WalletContextProvider>
    </QueryClientProvider>
  )
}
