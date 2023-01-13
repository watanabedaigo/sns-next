import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from '../auth/firebase'
import type { UserType } from 'types/UserType'

// 型エイリアス
export type AuthContextProps = {
  firebaseUser: UserType
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
  // routerオブジェクト作成
  const router = useRouter()

  // State
  // ログインしているユーザーを扱う
  const [firebaseUser, setFirebaseUser] = useState<UserType>(null)

  // ログインしていないユーザーが見ることのできるページを変数で管理
  const pageForNotLogin =
    router.pathname === '/signin' || router.pathname === '/signup'

  // contextで管理する値を定義
  const value = {
    firebaseUser,
  }

  // useEffect
  useEffect(() => {
    // firebaseで用意されている、ログイン情報が変わると発火するonAuthStateChanged
    const authStateChanged = onAuthStateChanged(auth, async (user) => {
      // State更新
      setFirebaseUser(user)

      // ユーザーがnullまたはundefinedでなく（ログインしている）
      // アクセスしているページのURLがpageForNotLoginでない時（ログイン後にしか見ることのできないページ）
      // /signupにリダイレクト
      !firebaseUser && !pageForNotLogin && (await router.push('/signup'))
    })
    return () => {
      authStateChanged()
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
