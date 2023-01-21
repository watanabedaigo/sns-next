import type { NextPage } from 'next'
import { usePostContext } from 'contexts/PostContext'
import Link from 'next/link'

const Home: NextPage = () => {
  // contextで管理している値を取得
  const { showPosts } = usePostContext()

  return (
    <div>
      <ul>
        {showPosts?.map((post) => {
          return (
            <li key={post.id}>
              <Link href={`/user/${post.userName}`}>
                <p>{post.userName}</p>
                <p>{post.content}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
