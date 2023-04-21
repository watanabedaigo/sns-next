import { ReactNode, createContext, useContext } from 'react'
import { FirebaseUserType } from 'types/FirebaseUserType'
import type { JsonUserType } from 'types/JsonUserType'
import { useAuth } from 'hooks/useAuth'

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
  // useAuthで管理しているロジックを取得
  const { firebaseUser, jsonUsers, jsonUser, setJsonUsers, loading } = useAuth()

  // contextで管理する値を定義
  const value = {
    firebaseUser,
    jsonUsers,
    jsonUser,
    setJsonUsers,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* loadingがfalse、つまりonAuthStateChangedが発火してフラッグが変わるのを待ってから表示させる */}
      {!loading && children}
    </AuthContext.Provider>
  )
}
