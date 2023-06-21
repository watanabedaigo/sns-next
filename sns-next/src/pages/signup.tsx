import type { NextPage } from 'next'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

const SignUp: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const { signUp } = useSns()

  return (
    <div>
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
            <Button type="submit" label="register" bgColor="bgWhite" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
