import type { NextPage } from 'next'
import { usePostContext } from 'contexts/PostContext'
import { useAuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { deleteData } from 'apis/sns'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePostContext()
  const { firebaseUser } = useAuthContext()

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'

  // 投稿削除の関数を定義
  const deletePost = (deletePostId: string) => {
    // Delete（Posts）
    // thenを使うことで、投稿の削除が完了した後に実行する処理を指定する
    deleteData(postsUrl, deletePostId).then(() => {
      // State更新
      // allPostsからidプロパティの値がdeletePostIdではないデータのみ抽出
      const newAllPosts = allPosts?.filter((post) => {
        return post.id !== deletePostId
      })
      newAllPosts && setAllPosts([...newAllPosts])

      // showPostsからidプロパティの値がdeletePostIdではないデータのみ抽出
      const newShowPosts = showPosts?.filter((post) => {
        return post.id !== deletePostId
      })
      newShowPosts && setShowPosts([...newShowPosts])
    })
  }

  return (
    <div>
      <ul>
        {showPosts?.map((post) => {
          return (
            <li key={post.id}>
              <Link href={`/user/${post.userName}`}>
                <p>{post.userName}</p>
                <p>{post.content}</p>
              </Link>
              {post.userId === firebaseUser?.uid && (
                <button
                  onClick={() => {
                    deletePost(post.id)
                  }}
                >
                  delete
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
