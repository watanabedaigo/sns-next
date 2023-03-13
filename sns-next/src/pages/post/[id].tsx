import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { usePostContext } from 'contexts/PostContext'
import { useAuthContext } from 'contexts/AuthContext'
import { postData } from 'apis/sns'
import { PostType } from 'types/PostType'
import type { EventType } from 'types/EventType'
import type { JsonUserType } from 'types/JsonUserType'
import { putData, deleteData } from 'apis/sns'
import Link from 'next/link'

import { ulid } from 'ulid'

const Post: NextPage = () => {
  // パスから投稿のidを取得し、jsonデータから該当する投稿を抽出する
  // routerオブジェクト作成
  const router = useRouter()

  // パスパラメータから表示する投稿のidを取得
  const { id } = router.query

  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePostContext()
  const { firebaseUser, jsonUsers, setJsonUsers } = useAuthContext()

  // 該当する投稿を抽出
  const targetPost = allPosts?.find((post) => {
    return post.id === id
  }) as PostType

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'
  const usersUrl = 'http://localhost:3001/users'

  // 投稿する関数を定義
  const addPost = (e: EventType) => {
    e.preventDefault()

    // 投稿フォームの値を取得
    const postInput = e.currentTarget.querySelector(
      'textarea'
    ) as HTMLTextAreaElement
    const postValue = postInput.value

    // jsonに追加するデータを作成
    const newPost = {
      id: ulid(),
      content: postValue,
      addFavoriteUserId: [],
      userId: targetJsonUser.id,
      userName: targetJsonUser.name,
      replyId: id as string,
    }

    // Create（Posts）
    // thenを使うことで、投稿の追加が完了した後に実行する処理を指定する
    postData(postsUrl, newPost).then(() => {
      // State更新
      allPosts && setAllPosts([...allPosts, newPost])
    })
  }

  // 表示している投稿へのリプライのみ抽出
  const replyPosts = allPosts?.filter((post) => {
    return post.replyId.indexOf(id as string) !== -1
  })

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
  const toggleFavorite = (targetPostId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.favoritePostId.indexOf(targetPostId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.favoritePostId.filter((postId) => {
        return postId !== targetPostId
      })
      targetJsonUser.favoritePostId = [...newData]
    } else {
      // 含んでいない場合は追加）d
      targetJsonUser.favoritePostId.push(targetPostId)
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
      <p>{targetPost?.content}</p>
      <div>
        <p>reply</p>
        <form onSubmit={addPost}>
          <div>
            <textarea id="post" name="post" placeholder="post" />
          </div>
          <div>
            <button>返信</button>
          </div>
        </form>
      </div>
      <ul>
        {replyPosts?.map((post) => {
          // todo 投稿内容を他に合わせる
          return (
            <li key={post.id}>
              <Link href={`/user/${post.userName}`}>
                <p>{post.userName}</p>
              </Link>
              <Link href={`/post/${post.id}`}>
                <p>{post.content}</p>
              </Link>
              {firebaseUser && (
                <div>
                  <button
                    onClick={() => {
                      toggleFavorite(post.id)
                    }}
                  >
                    {targetJsonUser?.favoritePostId.indexOf(post.id) !== -1
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
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Post
