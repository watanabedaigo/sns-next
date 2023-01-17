import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'auth/firebase'
import { FirebaseUserType } from 'types/firebaseUserType'
import type { JsonUserType } from 'types/JsonUserType'
import { getData } from 'apis/sns'

// 型エイリアス
export type AuthContextProps = {
  firebaseUser: FirebaseUserType
  jsonUsers: JsonUserType[]
  setJsonUsers: any
}

export type AuthProviderProps = {
  children: ReactNode
}

// contextオブジェクト作成
// Partial<T>は、オブジェクト型Tのすべてのプロパティをオプションプロパティにするユーティリティ型
const AuthContext = createContext<Partial<AuthContextProps>>({})

// contextで管理している値を取得する関数を定義。他のファイルでも使用するためexport
export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State
  // 「ログインしている」firebase側のユーザーを扱う
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUserType>(null)
  // 「全ての」json-server側の全ユーザーを扱う
  const [jsonUsers, setJsonUsers] = useState<JsonUserType[]>([])
  // リロード対策用のフラッグ
  const [loading, setLoading] = useState(true)

  // contextで管理する値を定義
  const value = {
    firebaseUser,
    jsonUsers,
    setJsonUsers,
  }

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
      // State更新
      setFirebaseUser(user)
      setLoading(false)
    })

    return () => {
      authStateChanged()
      unmounted = true
    }
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {/* loadingがfalse、つまりonAuthStateChangedが発火してフラッグが変わるのを待ってから表示させる */}
      {!loading && children}
    </AuthContext.Provider>
  )
}
