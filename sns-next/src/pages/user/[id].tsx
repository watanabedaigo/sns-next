import { useState } from 'react'
import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { putData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'
import type { JsonUserType } from 'types/JsonUserType'

const User: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  return (
    <div>
      <div>
        <h1>{targetJsonUser.name}</h1>
        <p>以下にこのユーザーの投稿を表示</p>
      </div>
    </div>
  )
}

export default User
