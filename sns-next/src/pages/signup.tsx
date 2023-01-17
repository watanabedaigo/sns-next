import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { auth } from 'auth/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import { postData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'
import type { JsonUserType } from 'types/JsonUserType'

const SignUp: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // contextで管理している値を取得
  const { jsonUsers, setJsonUsers } = useAuthContext()

  const signUp = async (e: EventType) => {
    e.preventDefault()

    // メールフォームの値を取得
    const emailInput = e.currentTarget.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement
    const emailValue = emailInput.value

    // パスワードフォームの値を取得
    const passwordInput = e.currentTarget.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement
    const passwordValue = passwordInput.value

    // firebaseで用意されている、ユーザー登録の関数
    // thenを使うことで、firebase側のユーザー登録が完了した後に実行する処理を指定する
    await createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((user) => {
        // firebase側に登録したユーザー情報をjson-serverにも追加
        // 追加するデータを作成
        // ※ json-server側のデータのidとfirebase側のユーザーのuilを紐付ける
        // ※ name,profileはこの後設定するため空文字、favoritePostId,followUserId,follwedUserIdは空の配列にしておく
        const newJsonUser = {
          id: user.user.uid,
          name: '',
          profile: '',
          favoritePostId: [],
          followUserId: [],
          follwedUserId: [],
        }

        // Create（Users）
        postData(usersUrl, newJsonUser)

        // State更新
        jsonUsers && setJsonUsers([...jsonUsers, newJsonUser])
      })
      .then(() => {
        // /add/userにリダイレクト
        router.push('/add/user')
      })
      .catch((Error) => {
        console.log(Error)
      })
  }

  return (
    <div>
      <p>SignUp</p>
      <div>
        <h1>ユーザ登録</h1>
        <form onSubmit={signUp}>
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input id="email" name="email" type="email" placeholder="email" />
          </div>
          <div>
            <label htmlFor="password">パスワード</label>
            <input id="password" name="password" type="password" />
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
