import type { NextPage } from 'next'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

const AddUserInfo: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const { addInfo } = useSns()

  return (
    <div>
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
            <Button type="submit" label="register" bgColor="bgWhite" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserInfo
