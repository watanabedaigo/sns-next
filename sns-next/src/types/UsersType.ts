import type { User } from 'firebase/auth'

// 型エイリアス
// UsersTypeの型
export type UsersType = {
  id: string
  name: string
  profile: string
  favoritePostId: string[]
  followUserId: string[]
  follwedUserId: string[]
}
