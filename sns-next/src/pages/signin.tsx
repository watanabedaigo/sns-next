import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { auth } from '../auth/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  const signIn = async (e: EventType) => {
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

    // firebaseで用意されている、ログインの関数
    await signInWithEmailAndPassword(auth, emailValue, passwordValue)

    // /にリダイレクト
    router.push('/')
  }

  return (
    <div>
      <p>SignIn</p>
      <div>
        <h1>ログイン</h1>
        <form onSubmit={signIn}>
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input id="email" name="email" type="email" placeholder="email" />
          </div>
          <div>
            <label htmlFor="password">パスワード</label>
            <input id="password" name="password" type="password" />
          </div>
          <div>
            <button>ログイン</button>
          </div>
        </form>
      </div>
      <ul>
        <li>
          <Link href="/signup">SignUp</Link>
        </li>
      </ul>
    </div>
  )
}

export default SignIn
