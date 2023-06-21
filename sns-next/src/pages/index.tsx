import type { NextPage } from 'next'
import Link from 'next/link'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

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
                  <Button
                    label={
                      targetJsonUser?.favoritePostId.indexOf(post.id) !== -1
                        ? 'remove'
                        : 'add'
                    }
                    bgColor={
                      targetJsonUser?.favoritePostId.indexOf(post.id) !== -1
                        ? 'bgBlack'
                        : 'bgWhite'
                    }
                    onClick={() => {
                      toggleFavorite(post.id)
                    }}
                  />
                  {post.userId === firebaseUser?.uid && (
                    <Button
                      label="delete"
                      bgColor="bgRed"
                      onClick={() => {
                        deletePost(post.id)
                      }}
                    />
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
