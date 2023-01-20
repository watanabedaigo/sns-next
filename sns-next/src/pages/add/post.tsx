import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { postData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'
import type { JsonUserType } from 'types/JsonUserType'
import { ulid } from 'ulid'

const AddPost: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // APIリクエスト先のURL
  const postsUrl = 'http://localhost:3001/posts'

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  const addInfo = (e: EventType) => {
    e.preventDefault()

    // 投稿フォームの値を取得
    const postInput = e.currentTarget.querySelector(
      'textarea'
    ) as HTMLTextAreaElement
    const postValue = postInput.value

    const newPost = {
      id: ulid(),
      content: postValue,
      addFavoriteUserId: [],
      userId: targetJsonUser.id,
      userName: targetJsonUser.name,
    }

    // Create（Users）
    postData(postsUrl, newPost)

    // /にリダイレクト
    router.push('/')
  }

  return (
    <div>
      <div>
        <h1>投稿</h1>
        <form onSubmit={addInfo}>
          <div>
            <textarea id="post" name="post" placeholder="post" />
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPost
