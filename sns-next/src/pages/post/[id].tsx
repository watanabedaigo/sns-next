import type { NextPage } from 'next'
import { postData } from 'apis/sns'
import { PostType } from 'types/PostType'
import type { EventType } from 'types/EventType'
import type { JsonUserType } from 'types/JsonUserType'
import Link from 'next/link'
import { ulid } from 'ulid'
import { useSns } from 'hooks/useSns'

const Post: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const {
    router,
    allPosts,
    setAllPosts,
    firebaseUser,
    jsonUsers,
    deletePost,
    toggleFavorite,
  } = useSns()

  // パスパラメータから表示する投稿のidを取得
  const { id } = router.query

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
  const addReplyPost = (e: EventType) => {
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

  return (
    <div>
      <p>{targetPost?.content}</p>
      <div>
        <p>reply</p>
        <form onSubmit={addReplyPost}>
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
