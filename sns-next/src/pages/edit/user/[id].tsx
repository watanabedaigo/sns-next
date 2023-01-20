import { useState } from 'react'
import type { NextPage } from 'next'
import type { EventType } from 'types/EventType'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { putData } from 'apis/sns'
import { useAuthContext } from 'contexts/AuthContext'
import type { JsonUserType } from 'types/JsonUserType'

const EditUserInfo: NextPage = () => {
  // routerオブジェクト作成
  const router = useRouter()

  // APIリクエスト先のURL
  const usersUrl = 'http://localhost:3001/users'

  // contextで管理している値を取得
  const { firebaseUser, jsonUsers } = useAuthContext()

  // ログインしているfirebaseUserのuidをもとに、jsonUsersの中からログインしているユーザーデータを特定
  const targetJsonUser = jsonUsers?.find((jsonUser) => {
    return jsonUser.id === firebaseUser?.uid
  }) as JsonUserType

  // formの初期表示を格納する変数を定義
  const nameDefaultValue: string | number = targetJsonUser.name
  const profileDefaultValue: string | number = targetJsonUser.profile

  const addInfo = (e: EventType) => {
    e.preventDefault()

    // 名前フォームの値を取得
    const nameInput = e.currentTarget.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement
    const nameValue = nameInput.value

    // プロフィールフォームの値を取得
    const profileInput = e.currentTarget.querySelector(
      'input[name="profile"]'
    ) as HTMLInputElement
    const profileValue = profileInput.value

    if (jsonUsers && firebaseUser) {
      // そのデータのname,profileプロパティを上書き
      targetJsonUser.name = nameValue
      targetJsonUser.profile = profileValue

      // Update（Users）
      putData(usersUrl, targetJsonUser.id, targetJsonUser)
    }

    // /にリダイレクト
    router.push('/')
  }

  return (
    <div>
      <div>
        <h1>アカウント情報修正</h1>
        <form onSubmit={addInfo}>
          <div>
            <label htmlFor="email">名前</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="name"
              defaultValue={nameDefaultValue}
            />
          </div>
          <div>
            <label htmlFor="password">プロフィール</label>
            <input
              id="profile"
              name="profile"
              type="text"
              placeholder="profile"
              defaultValue={profileDefaultValue}
            />
          </div>
          <div>
            <button>修正</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserInfo
