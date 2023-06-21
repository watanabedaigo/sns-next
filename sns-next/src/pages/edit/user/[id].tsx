import type { NextPage } from 'next'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

const EditUserInfo: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const { editInfo, nameDefaultValue, profileDefaultValue } = useSns()

  return (
    <div>
      <div>
        <h1>アカウント情報修正</h1>
        <form onSubmit={editInfo}>
          <div>
            <label htmlFor="email">名前</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="name"
              defaultValue={nameDefaultValue}
            />
          </div>
          <div>
            <label htmlFor="password">プロフィール</label>
            <input
              id="profile"
              name="profile"
              type="text"
              placeholder="profile"
              defaultValue={profileDefaultValue}
            />
          </div>
          <div>
            <Button type="submit" label="edit" bgColor="bgWhite" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserInfo
