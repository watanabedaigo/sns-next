import React from 'react'
import { useAuthContext } from 'contexts/AuthContext'
import { auth } from 'auth/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import type { JsonUserType } from 'types/JsonUserType'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
  // routerオブジェクト作成
  const router = useRouter()

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // ログアウトの関数を定義
  const logout = async () => {
    // firebaseで用意されている、ログアウトの関数
    await signOut(auth)

    // /signupにリダイレクト
    await router.push('/signin')
  }

  if (router.pathname === '/add/user') {
    return (
      <header>
        <p>アカウント情報追加</p>
      </header>
    )
  }

  return (
    <header>
      <p>{targetJsonUser ? targetJsonUser.name : 'ログインしていない'}</p>
      {firebaseUser && <button onClick={logout}>ログアウト</button>}
    </header>
  )
})

export default Header
