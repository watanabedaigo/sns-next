import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'auth/firebase'
import { FirebaseUserType } from 'types/FirebaseUserType'
import type { JsonUserType } from 'types/JsonUserType'
import { getData } from 'apis/sns'

export const useAuth = () => {
  // State
  // 「ログインしている」firebase側のユーザーを扱う
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUserType>(null)
  // 「全ての」json-server側のユーザーを扱う
  const [jsonUsers, setJsonUsers] = useState<JsonUserType[]>([])
  // 「ログインしている」json-server側のユーザーを扱う
  const [jsonUser, setJsonUser] = useState<JsonUserType>()
  // リロード対策用のフラッグ
  const [loading, setLoading] = useState<boolean>(true)

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // useEffect
  // 依存配列は空なので、中の処理は初回レンダリング時のみ実行
  useEffect(() => {
    // クリーンアップ関数（React v18対応）
    let unmounted = false

    // Read（Users）
    getData(usersUrl)
      .then((usersData) => {
        if (!unmounted) {
          // State更新
          // usersDataはallDataType（JsonUserType[] | PostType[]）なので、型アサーションでJsonUserType[]で上書き
          setJsonUsers(usersData as JsonUserType[])
        }
      })
      .catch((Error) => {
        console.error(Error)
      })

    // firebaseで用意されている、ログイン情報が変わると発火するonAuthStateChanged
    const authStateChanged = onAuthStateChanged(auth, async (user) => {
      // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
      // const targetJsonUser = jsonUsers.find((jsonUser) => {
      //   return jsonUser.id === firebaseUser?.uid
      // }) as JsonUserType

      // State更新
      setFirebaseUser(user)
      setLoading(false)
      // setJsonUser(targetJsonUser)
    })

    return () => {
      authStateChanged()
      unmounted = true
    }
  }, [])

  return {
    firebaseUser,
    jsonUsers,
    jsonUser,
    setJsonUsers,
    loading,
  }
}
