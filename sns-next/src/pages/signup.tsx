import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { auth } from '../auth/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'

const SignUp: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

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
    await createUserWithEmailAndPassword(auth, emailValue, passwordValue)

    // /にリダイレクト
    router.push('/')
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
      <ul>
        <li>
          <Link href="/signin">SignIn</Link>
        </li>
      </ul>
    </div>
  )
}

export default SignUp
