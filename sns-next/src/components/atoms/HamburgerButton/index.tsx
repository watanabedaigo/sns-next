import React from 'react'
import styles from './styles.module.scss'
import { useSns } from 'hooks/useSns'

export const HamburgerButton = () => {
  // useSnsで管理しているロジックを取得
  const { isOpen, toggleMenu } = useSns()

  return (
    <button
      type="button"
      onClick={toggleMenu}
      className={styles.hamburger}
      aria-expanded={isOpen}
      aria-label="menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}
