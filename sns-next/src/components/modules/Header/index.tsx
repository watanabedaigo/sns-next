import React from 'react'
import { useAuthContext } from 'contexts/AuthContext'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
  // contextで管理している値を取得
  const { user } = useAuthContext()

  return (
    <header>
      <p>{user ? user.email : 'ログイン前'}</p>
      {user && <p>{user.uid}</p>}
    </header>
  )
})

export default Header
