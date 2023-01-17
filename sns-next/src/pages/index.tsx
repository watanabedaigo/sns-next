import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthContext } from 'contexts/AuthContext'

const Home: NextPage = () => {
  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  return (
    <div>
      <p>top</p>
      <ul>
        <li>
          <Link href="/signin">SignIn</Link>
        </li>
        <li>
          <Link href="/signup">SignUp</Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
