import React from 'react'
import { useAuthContext } from 'contexts/AuthContext'
import { auth } from 'auth/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import type { JsonUserType } from 'types/JsonUserType'
import Link from 'next/link'
import { deleteData } from 'apis/sns'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
  // routerオブジェクト作成
  const router = useRouter()

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers, setJsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // ログアウトの関数を定義
  const logout = async () => {
    // firebaseで用意されている、ログアウトの関数
    await signOut(auth)

    // /signinにリダイレクト
    await router.push('/signin')
  }

  // ユーザー削除の関数を定義
  const deleteUser = async () => {
    // firebase側のユーザー削除
    // thenを使うことで、firebase側のユーザー削除が完了した後に実行する処理を指定する
    firebaseUser
      ?.delete()
      .then(() => {
        // json-server側のユーザー削除
        // 削除するユーザーのidを取得
        const deleteTargetUserId = targetJsonUser.id
        // Delete（Users）
        deleteData(usersUrl, deleteTargetUserId)

        // State更新
        // idプロパティの値がdeleteTargetUserIdではないデータのみ抽出
        const newUsers = jsonUsers?.filter((jsonUser) => {
          return jsonUser.id !== deleteTargetUserId
        })
        newUsers && setJsonUsers([...newUsers])
      })
      .then(() => {
        // /signinにリダイレクト
        router.push('/signin')
      })
      .catch((Error) => {
        console.log(Error)
      })
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
      {firebaseUser && targetJsonUser ? (
        // ログインしている時の表示
        <div>
          <ul>
            <li>
              <p>アカウント名：{targetJsonUser.name}</p>
            </li>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <button onClick={logout}>logout</button>
            </li>
            <li>
              <Link href={`/edit/user/${targetJsonUser.name}`}>
                EditUserInfo
              </Link>
            </li>
            <li>
              <button onClick={deleteUser}>deleteUser</button>
            </li>
            <li>
              <Link href="/add/post">Post</Link>
            </li>
            <li>
              <Link href="/users">Users</Link>
            </li>
          </ul>
        </div>
      ) : (
        // ログインしていない時の表示
        <div>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/signin">SignIn</Link>
            </li>
            <li>
              <Link href="/signup">SignUp</Link>
            </li>
            <li>
              <Link href="/users">Users</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
})

export default Header
