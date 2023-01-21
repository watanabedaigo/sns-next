import type { NextPage } from 'next'
import { useAuthContext } from 'contexts/AuthContext'
import Link from 'next/link'

const Users: NextPage = () => {
  // contextで管理している値を取得
  const { jsonUsers } = useAuthContext()

  return (
    <div>
      <ul>
        {jsonUsers?.map((user) => {
          return (
            <li key={user.id}>
              <Link href={`/user/${user.name}`}>{user.name}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Users
