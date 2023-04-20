import type { NextPage } from 'next'
import Link from 'next/link'
import { useSns } from 'hooks/useSns'

const Home: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const {
    showPosts,
    firebaseUser,
    targetJsonUser,
    deletePost,
    toggleFavorite,
  } = useSns()

  return (
    <div>
      <ul>
        {showPosts?.map((post) => {
          return (
            <li key={post.id}>
              <Link href={`/user/${post.userId}`}>
                <p>{post.userName}</p>
              </Link>
              <Link href={`/post/${post.id}`}>
                <p>{post.content}</p>
              </Link>
              {firebaseUser && (
                <div>
                  <Link href={`/post/${post.id}`}>reply</Link>
                  <button
                    onClick={() => {
                      toggleFavorite(post.id)
                    }}
                  >
                    {targetJsonUser?.favoritePostId.indexOf(post.id) !== -1
                      ? 'remove'
                      : 'add'}
                  </button>
                  {post.userId === firebaseUser?.uid && (
                    <button
                      onClick={() => {
                        deletePost(post.id)
                      }}
                    >
                      delete
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
