import type { NextPage } from 'next'
import { usePostContext } from 'contexts/PostContext'
import { useAuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { PostType } from 'types/PostType'
import type { JsonUserType } from 'types/JsonUserType'
import { putData } from 'apis/sns'

const Users: NextPage = () => {
  // contextで管理している値を取得
  const { allPosts, setAllPosts, showPosts, setShowPosts } = usePostContext()
  const { firebaseUser, jsonUsers, setJsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // 投稿をお気に入りに追加する関数を定義
  const toggleFollow = (targetUserId: string) => {
    // json-serverのユーザーのfavoritePostIdプロパティ（配列）に投稿のidを追加
    // ユーザーのfavoritePostIdプロパティを上書き
    // 条件分岐
    if (targetJsonUser.followUserId.indexOf(targetUserId) !== -1) {
      // 既に含んでいる場合は取り除く
      const newData = targetJsonUser.followUserId.filter((userId) => {
        return userId !== targetUserId
      })
      targetJsonUser.followUserId = [...newData]
    } else {
      // 含んでいない場合は追加
      targetJsonUser.followUserId.push(targetUserId)
    }

    // Update（Users）
    putData(usersUrl, targetJsonUser.id, targetJsonUser)

    // State更新
    // jsonUsers
    // 変更対象（ログインしているユーザー）以外のデータを抽出
    const newUsers = jsonUsers?.filter((user) => {
      return user.id !== targetJsonUser.id
    }) as JsonUserType[]

    setJsonUsers([...newUsers, targetJsonUser])

    // showPosts
    // 自分の投稿を抽出
    const MyPosts = allPosts?.filter((post) => {
      return post.userId === firebaseUser?.uid
    }) as PostType[]

    // フォローしているユーザーの投稿を抽出
    // json-serverにおける、ログインしているユーザーデータのfollowUserIdプロパティ（配列）にidが含まれているユーザーの投稿を表示
    // = followUserId（配列）中に、post.idが入っていれば表示
    const followsPosts = allPosts?.filter((post) => {
      return targetJsonUser.followUserId.indexOf(post.userId) !== -1
    }) as PostType[]

    setShowPosts([...MyPosts, ...followsPosts])
  }

  return (
    <div>
      <ul>
        {jsonUsers?.map((user) => {
          return (
            <li key={user.id}>
              <Link href={`/user/${user.name}`}>{user.name}</Link>
              {targetJsonUser?.id !== user.id && (
                <button
                  onClick={() => {
                    toggleFollow(user.id)
                  }}
                >
                  {targetJsonUser?.followUserId.indexOf(user.id) !== -1
                    ? 'remove'
                    : 'add'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Users
