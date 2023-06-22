import type { NextPage } from 'next'
import Link from 'next/link'
import { useSns } from 'hooks/useSns'
import { Button } from 'components/atoms/Button'

const User: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const {
    allPosts,
    firebaseUser,
    jsonUsers,
    targetJsonUser,
    deletePost,
    toggleFollow,
    toggleFavorite,
    changeTab,
    router,
  } = useSns()

  // パスパラメータから表示するユーザーのidを取得
  const { id } = router.query

  // 取得したidから、全投稿の中から表示する投稿を抽出
  const targetPosts = allPosts?.filter((post) => {
    return post.userId === id
  })

  // 取得したidから、全ユーザーから表示するユーザーを抽出
  const targetUser = jsonUsers?.find((user) => {
    return user.id === id
  })

  // 表示するユーザーのfavoriteから、表示する投稿を抽出
  const favoritePostIds = targetUser?.favoritePostId
  const favoritePosts = favoritePostIds?.map((favoritePostId) => {
    return allPosts?.find((post) => {
      return post.id === favoritePostId
    })
  })

  // 表示するユーザーのfollowUserIdから、表示するユーザを抽出
  const followUserIds = targetUser?.followUserId
  const followUsers = followUserIds?.map((followUserId) => {
    return jsonUsers?.find((user) => {
      return user.id === followUserId
    })
  })

  return (
    <div>
      <div>
        <div>
          <h1>{targetUser?.name}</h1>
          {targetJsonUser?.id !== id && (
            <Button
              label={
                targetJsonUser?.followUserId.indexOf(id as string) !== -1
                  ? 'remove'
                  : 'add'
              }
              bgColor={
                targetJsonUser?.followUserId.indexOf(id as string) !== -1
                  ? 'bgBlue'
                  : 'bgOrange'
              }
              onClick={() => {
                toggleFollow(id as string)
              }}
            />
          )}
        </div>
        <ul>
          <li>
            <button
              role="tab"
              aria-selected="true"
              aria-controls="content-mypost"
              id="tab-mypost"
              onClick={changeTab}
              className="btn--tab"
            >
              mypost
            </button>
          </li>
          <li>
            <button
              role="tab"
              aria-selected="false"
              aria-controls="content-favorites"
              id="tab-favorites"
              onClick={changeTab}
              className="btn--tab"
            >
              favorites
            </button>
          </li>
          <li>
            <button
              role="tab"
              aria-selected="false"
              aria-controls="content-follows"
              id="tab-follows"
              onClick={changeTab}
              className="btn--tab"
            >
              follows
            </button>
          </li>
        </ul>
        <div>
          <div
            id="content-mypost"
            role="tabpanel"
            aria-labelledby="tab-mypost"
            aria-hidden="false"
            className="tab"
          >
            <h2>mypost</h2>
            <ul>
              {targetPosts?.map((post) => {
                return (
                  <li key={post.id}>
                    <Link href={`/user/${post.userName}`}>
                      <p>{post.userName}</p>
                    </Link>
                    <Link href={`/post/${post.id}`}>
                      <p>{post.content}</p>
                    </Link>
                    {post.userId === firebaseUser?.uid && (
                      <Button
                        label="delete"
                        bgColor="bgRed"
                        onClick={() => {
                          deletePost(post.id)
                        }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          <div
            id="content-favorites"
            role="tabpanel"
            aria-labelledby="tab-favorites"
            aria-hidden="true"
            className="tab"
          >
            <h2>favorites</h2>
            <ul>
              {favoritePosts?.map((post) => {
                return (
                  <li key={post?.content}>
                    {post?.content}
                    <Button
                      label={
                        targetJsonUser?.favoritePostId.indexOf(
                          post?.id as string
                        ) !== -1
                          ? 'remove'
                          : 'add'
                      }
                      bgColor={
                        targetJsonUser?.favoritePostId.indexOf(
                          post?.id as string
                        ) !== -1
                          ? 'bgBlue'
                          : 'bgOrange'
                      }
                      onClick={() => {
                        toggleFavorite(post?.id as string)
                      }}
                    />
                    {post?.userId === firebaseUser?.uid && (
                      <Button
                        label="delete"
                        bgColor="bgRed"
                        onClick={() => {
                          deletePost(post?.id as string)
                        }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          <div
            id="content-follows"
            role="tabpanel"
            aria-labelledby="tab-follows"
            aria-hidden="true"
            className="tab"
          >
            <h2>follows</h2>
            <ul>
              {followUsers?.map((user) => {
                return (
                  <li key={user?.id}>
                    <Link href={`/user/${user?.id}`}>{user?.name}</Link>
                    {targetJsonUser?.id !== user?.id && (
                      <Button
                        label={
                          targetJsonUser?.followUserId.indexOf(
                            user?.id as string
                          ) !== -1
                            ? 'remove'
                            : 'add'
                        }
                        bgColor={
                          targetJsonUser?.followUserId.indexOf(
                            user?.id as string
                          ) !== -1
                            ? 'bgBlue'
                            : 'bgOrange'
                        }
                        onClick={() => {
                          toggleFollow(user?.id as string)
                        }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
