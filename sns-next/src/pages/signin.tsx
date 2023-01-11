import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { auth } from '../auth/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  const router = useRouter()

  const handleSubmit = async (e: EventType) => {
    e.preventDefault()

    const emailInput = e.currentTarget.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement
    const emailValue = emailInput.value
    console.log(emailValue)

    const passwordInput = e.currentTarget.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement
    const passwordValue = passwordInput.value
    console.log(passwordValue)

    await signInWithEmailAndPassword(auth, emailValue, passwordValue)

    router.push('/')
  }

  return (
    <div>
      <p>SignIn</p>
      <div>
        <h1>ログイン</h1>
        <form onSubmit={handleSubmit}>
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
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/signup">SignUp</Link>
        </li>
      </ul>
    </div>
  )
}

export default SignIn
