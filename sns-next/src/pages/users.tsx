import type { NextPage } from 'next'
import Link from 'next/link'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

const Users: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const { firebaseUser, jsonUsers, targetJsonUser, toggleFollow } = useSns()

  return (
    <div>
      <ul>
        {jsonUsers?.map((user) => {
          return (
            <li key={user.id}>
              <Link href={`/user/${user.id}`}>{user.name}</Link>
              {firebaseUser && targetJsonUser?.id !== user.id && (
                <Button
                  label={
                    targetJsonUser?.followUserId.indexOf(user.id) !== -1
                      ? 'remove'
                      : 'add'
                  }
                  bgColor={
                    targetJsonUser?.followUserId.indexOf(user.id) !== -1
                      ? 'bgBlue'
                      : 'bgOrange'
                  }
                  onClick={() => {
                    toggleFollow(user.id)
                  }}
                />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Users
