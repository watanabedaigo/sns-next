import React from 'react'
import { useAuthContext } from 'contexts/AuthContext'
import { auth } from 'auth/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
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

  return (
    <header>
      <p>{firebaseUser ? firebaseUser.email : 'ログイン前'}</p>
      {firebaseUser && <button onClick={logout}>ログアウト</button>}
    </header>
  )
})

export default Header
