import '../styles/reset.min.css'
import '../styles/global.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from 'contexts/AuthContext'
import { PostProvider } from 'contexts/PostContext'

import Header from 'components/modules/Header/'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PostProvider>
        <Header />
        <Component {...pageProps} />
      </PostProvider>
    </AuthProvider>
  )
}

export default MyApp
