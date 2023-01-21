import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { usePostContext } from 'contexts/PostContext'
import Link from 'next/link'

const User: NextPage = () => {
  // contextで管理している値を取得
  const { allPosts } = usePostContext()

  // routerオブジェクト作成
  const router = useRouter()

  // パスパラメータからユーザーのidを取得
  const { id } = router.query

  // 取得したidから、全投稿の中から該当する投稿を抽出
  const targetPosts = allPosts?.filter((post) => {
    return post.userName === id
  })

  return (
    <div>
      <div>
        <h1>{id}</h1>
        <ul>
          {targetPosts?.map((post) => {
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
    </div>
  )
}

export default User
