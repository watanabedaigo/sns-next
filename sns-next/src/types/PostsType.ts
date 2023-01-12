import type { User } from 'firebase/auth'

// 型エイリアス
// PostsTypeの型
export type PostsType = {
  id: string
  content: string
  addFavoriteUserId: string[]
  userId: string
}
