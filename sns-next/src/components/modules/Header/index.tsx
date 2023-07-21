import React from 'react'
import Link from 'next/link'
import styles from 'components/atoms/Button/styles.module.scss'
import { Button } from 'components/atoms/Button'
import { useSns } from 'hooks/useSns'
import { HamburgerButton } from 'components/atoms/HamburgerButton'

// メモ化して。親コンポーネントレンダリングによる再レンダリング防止
const Header: React.FC = React.memo(() => {
  // useSnsで管理しているロジックを取得
  const { targetJsonUser, logout, deleteUser, isLogin, isOpen } = useSns()

  return (
    <header>
      <div>
        {isLogin ? (
          // ログインしている時の表示
          <div>
            <ul>
              <li>
                <p>アカウント名：{targetJsonUser?.name}</p>
              </li>
              <li>
                <Link
                  href="/"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  Home
                </Link>
              </li>
              <li>
                <Button label="logout" bgColor="bgBlue" onClick={logout} />
              </li>
              <li>
                <Link
                  href={`/edit/user/${targetJsonUser?.name}`}
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  EditUserInfo
                </Link>
              </li>
              <li>
                <Button
                  label="deleteUser"
                  bgColor="bgRed"
                  onClick={deleteUser}
                />
              </li>
              <li>
                <Link
                  href="/add/post"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  Post
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  Users
                </Link>
              </li>
            </ul>
            <HamburgerButton />
          </div>
        ) : (
          // ログインしていない時の表示
          <div>
            <ul>
              <li>
                <Link
                  href="/"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  SignIn
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  SignUp
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className={[styles.btn, styles.bgWhite].join(' ')}
                >
                  Users
                </Link>
              </li>
            </ul>
            <HamburgerButton />
          </div>
        )}
      </div>
    </header>
  )
})

export default Header
