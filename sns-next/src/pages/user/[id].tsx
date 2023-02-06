import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { usePostContext } from 'contexts/PostContext'
import { useAuthContext } from 'contexts/AuthContext'
import { putData, deleteData } from 'apis/sns'
import { PostType } from 'types/PostType'
import type { JsonUserType } from 'types/JsonUserType'

import Link from 'next/link'

const User: NextPage = () => {
  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePostContext()
  const { firebaseUser, jsonUsers, setJsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // routerオブジェクト作成
  const router = useRouter()

  // パスパラメータから表示するユーザーのidを取得
  const { id } = router.query

  // 取得したidから、全投稿の中から表示する投稿を抽出
  const targetPosts = allPosts?.filter((post) => {
    return post.userId === id
  })

  // 取得したidから、全ユーザーから表示するユーザーを抽出
  const targetUser = jsonUsers?.find((user) => {
    return user.id === id
  })

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'
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

  // 投稿をお気に入りに追加する関数を定義
  const toggleFollow = (targetUserId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.followUserId.indexOf(targetUserId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.followUserId.filter((userId) => {
        return userId !== targetUserId
      })
      targetJsonUser.followUserId = [...newData]
    } else {
      // 含んでいない場合は追加
      targetJsonUser.followUserId.push(targetUserId)
    }

    // Update（Users）
    putData(usersUrl, targetJsonUser.id, targetJsonUser)

    // State更新
    // jsonUsers
    // 変更対象（ログインしているユーザー）以外のデータを抽出
    const newUsers = jsonUsers?.filter((user) => {
      return user.id !== targetJsonUser.id
    }) as JsonUserType[]

    setJsonUsers([...newUsers, targetJsonUser])

    // showPosts
    // 自分の投稿を抽出
    const MyPosts = allPosts?.filter((post) => {
      return post.userId === firebaseUser?.uid
    }) as PostType[]

    // フォローしているユーザーの投稿を抽出
    // json-serverにおける、ログインしているユーザーデータのfollowUserIdプロパティ（配列）にidが含まれているユーザーの投稿を表示
    // = followUserId（配列）中に、post.idが入っていれば表示
    const followsPosts = allPosts?.filter((post) => {
      return targetJsonUser.followUserId.indexOf(post.userId) !== -1
    }) as PostType[]

    setShowPosts([...MyPosts, ...followsPosts])
  }

  console.log(id)

  return (
    <div>
      <div>
        <div>
          <h1>{targetUser?.name}</h1>
          {targetJsonUser?.id !== id && (
            <button
              onClick={() => {
                toggleFollow(id as string)
              }}
            >
              {targetJsonUser?.followUserId.indexOf(id as string) !== -1
                ? 'remove'
                : 'add'}
            </button>
          )}
        </div>
        <ul>
          {targetPosts?.map((post) => {
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
    </div>
  )
}

export default User
