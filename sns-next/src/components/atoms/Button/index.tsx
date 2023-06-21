import React from 'react'
import styles from './styles.module.scss'

interface ButtonProps {
  type?: 'button' | 'submit'
  bgColor?: string
  label: string
  onClick?: () => void
}

export const Button = ({
  type = 'button',
  label,
  bgColor = 'bgWhite',
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={[styles.btn, styles[bgColor]].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
