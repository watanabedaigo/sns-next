import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
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
