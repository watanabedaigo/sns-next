import type { NextPage } from 'next'
import { usePostContext } from 'contexts/PostContext'
import { useAuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { putData, deleteData } from 'apis/sns'
import { useRouter } from 'next/router'
import type { JsonUserType } from 'types/JsonUserType'

const Home: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePostContext()
  const { firebaseUser, jsonUsers, setJsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'
  const usersUrl = 'http://localhost:3001/users'

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

  // 投稿をお気に入りに追加する関数を定義
  const addFavorite = (addFavoritePostId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.favoritePostId.indexOf(addFavoritePostId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.favoritePostId.filter((postId) => {
        return postId !== addFavoritePostId
      })
      targetJsonUser.favoritePostId = [...newData]
    } else {
      // 含んでいない場合は追加）d
      targetJsonUser.favoritePostId.push(addFavoritePostId)
    }

    // Update（Users）
    putData(usersUrl, targetJsonUser.id, targetJsonUser)

    // State更新
    // 変更対象（ログインしているユーザー）以外のデータを抽出
    const newUsers = jsonUsers?.filter((user) => {
      return user.id !== targetJsonUser.id
    }) as JsonUserType[]

    setJsonUsers([...newUsers, targetJsonUser])
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
              <button
                onClick={() => {
                  addFavorite(post.id)
                }}
              >
                {targetJsonUser.favoritePostId.indexOf(post.id) !== -1
                  ? 'remove'
                  : 'add'}
              </button>
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
