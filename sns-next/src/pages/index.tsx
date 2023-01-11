import type { NextPage } from 'next'
import Link from 'next/link'
import { auth } from '../auth/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    await router.push('/signin')
  }

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
        <li>
          <button onClick={handleLogout}>ログアウト</button>
        </li>
      </ul>
    </div>
  )
}

export default Home
