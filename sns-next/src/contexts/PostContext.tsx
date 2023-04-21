import { ReactNode, createContext, useContext } from 'react'
import { PostType } from 'types/PostType'
import { usePost } from 'hooks/usePost'

// 型エイリアス
export type PostContextProps = {
  allPosts: PostType[]
  setAllPosts: any
  showPosts: PostType[]
  setShowPosts: any
}

export type PostProviderProps = {
  children: ReactNode
}

// contextオブジェクト作成
// Partial<T>は、オブジェクト型Tのすべてのプロパティをオプションプロパティにするユーティリティ型
const PostContext = createContext<Partial<PostContextProps>>({})

// contextで管理している値を取得する関数を定義。他のファイルでも使用するためexport
export const usePostContext = () => {
  return useContext(PostContext)
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  // usePostで管理しているロジックを取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePost()

  // contextで管理する値を定義
  const value = {
    allPosts,
    setAllPosts,
    showPosts,
    setShowPosts,
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}
