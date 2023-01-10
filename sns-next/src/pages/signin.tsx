import type { NextPage } from 'next'
import Link from 'next/link'

const SignIn: NextPage = () => {
  return (
    <div>
      <p>SignIn</p>
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
