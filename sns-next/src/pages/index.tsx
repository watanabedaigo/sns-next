import type { NextPage } from 'next'
import Link from 'next/link'
import { auth } from '../auth/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useAuthContext } from 'contexts/AuthContext'

const Home: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // contextで管理している値を取得
  const { firebaseUser } = useAuthContext()

  // ログアウトの関数を定義
  const logout = async () => {
    // firebaseで用意されている、ログアウトの関数
    await signOut(auth)

    // /signupにリダイレクト
    await router.push('/signin')
  }

  // ユーザーがnullまたはundefinedでない時のreturn（ログインしている）
  if (!firebaseUser) {
    return <p>loading</p>
  }

  return (
    <div>
      <p>top</p>
      <ul>
        <li>
          <button onClick={logout}>ログアウト</button>
        </li>
      </ul>
    </div>
  )
}

export default Home
