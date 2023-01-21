import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react'
import { PostType } from 'types/PostType'
import { JsonUserType } from 'types/JsonUserType'
import { getData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'

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
  // contextで管理している値を取得
  const { jsonUsers, firebaseUser } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // State
  // 全投稿を扱う
  const [allPosts, setAllPosts] = useState<PostType[]>([])
  // 表示する投稿を扱う（ログインしていない時：表示する投稿＝全投稿 / ログインしている時：表示する投稿＝自分の投稿とフォローしているユーザーの投稿）
  const [showPosts, setShowPosts] = useState<PostType[]>([])

  // contextで管理する値を定義
  const value = {
    allPosts,
    setAllPosts,
    showPosts,
    setShowPosts,
  }

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'

  // useEffect
  // 依存配列にfirebaseUserを指定することで、ログイン状態が変わる（ユーザーが変わる / ログアウトする）度に処理を実行する
  useEffect(() => {
    // クリーンアップ関数（React v18対応）
    let unmounted = false

    // Read（Posts）
    getData(postsUrl)
      .then((postsData) => {
        if (!unmounted) {
          // 取得したデータを型アサーションで型上書き
          const getPosts = postsData as PostType[]

          // State更新
          setAllPosts([...getPosts])

          // ログインしているかどうかでStateの値を変える
          if (firebaseUser) {
            // ログインしている時：表示する投稿＝自分の投稿とフォローしているユーザーの投稿（post ≠ showPosts）
            // 自分の投稿を抽出
            const MyPosts = getPosts.filter((post) => {
              return post.userId === firebaseUser.uid
            }) as PostType[]

            // フォローしているユーザーの投稿を抽出
            // json-serverにおける、ログインしているユーザーデータのfollowUserIdプロパティ（配列）にidが含まれているユーザーの投稿を表示
            // = followUserId（配列）中に、post.idが入っていれば表示
            const followsPosts = getPosts.filter((post) => {
              return targetJsonUser.followUserId.indexOf(post.userId) !== -1
            }) as PostType[]

            setShowPosts([...MyPosts, ...followsPosts])
          } else {
            // ログインしていない時：表示する投稿＝全投稿（post = showPosts）
            setShowPosts([...getPosts])
          }
        }
      })
      .catch((Error) => {
        console.error(Error)
      })

    return () => {
      unmounted = true
    }
  }, [firebaseUser])

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}
