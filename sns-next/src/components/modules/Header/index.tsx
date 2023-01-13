import React from 'react'
import { useAuthContext } from 'contexts/AuthContext'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
  // contextで管理している値を取得
  const { firebaseUser } = useAuthContext()

  return (
    <header>
      <p>{firebaseUser ? firebaseUser.email : 'ログイン前'}</p>
      {firebaseUser && <p>{firebaseUser.uid}</p>}
    </header>
  )
})

export default Header
