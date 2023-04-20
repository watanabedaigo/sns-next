import type { NextPage } from 'next'
import Link from 'next/link'
import { useSns } from 'hooks/useSns'

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
                <button
                  onClick={() => {
                    toggleFollow(user.id)
                  }}
                >
                  {targetJsonUser?.followUserId.indexOf(user.id) !== -1
                    ? 'remove'
                    : 'add'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Users
