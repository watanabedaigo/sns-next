import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { putData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'
import type { JsonUserType } from 'types/JsonUserType'

const AddUserInfo: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  const addInfo = (e: EventType) => {
    e.preventDefault()

    // 名前フォームの値を取得
    const nameInput = e.currentTarget.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement
    const nameValue = nameInput.value

    // プロフィールフォームの値を取得
    const profileInput = e.currentTarget.querySelector(
      'input[name="profile"]'
    ) as HTMLInputElement
    const profileValue = profileInput.value

    if (jsonUsers && firebaseUser) {
      // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
      const targetJsonUser = jsonUsers.find((jsonUser) => {
        return jsonUser.id === firebaseUser.uid
      }) as JsonUserType

      // そのデータのname,profileプロパティを上書き
      targetJsonUser.name = nameValue
      targetJsonUser.profile = profileValue

      // Update（Users）
      putData(usersUrl, firebaseUser.uid, targetJsonUser)
    }

    // /にリダイレクト
    router.push('/')
  }

  return (
    <div>
      <p>AddUserInfo</p>
      <div>
        <h1>アカウント情報追加</h1>
        <form onSubmit={addInfo}>
          <div>
            <label htmlFor="email">名前</label>
            <input id="name" name="name" type="text" placeholder="name" />
          </div>
          <div>
            <label htmlFor="password">プロフィール</label>
            <input
              id="profile"
              name="profile"
              type="text"
              placeholder="profile"
            />
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserInfo