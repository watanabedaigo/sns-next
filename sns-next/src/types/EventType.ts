// 型エイリアス
// eventの型
// export type EventType =
//   | React.FormEvent<HTMLFormElement>
//   | React.MouseEvent<HTMLButtonElement>

export type EventType = {
  onSubmit: React.FormEvent<HTMLFormElement>
  onClick: React.MouseEvent<HTMLButtonElement>
}
