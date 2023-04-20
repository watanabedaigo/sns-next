import type { NextPage } from 'next'
import { useSns } from 'hooks/useSns'

const AddPost: NextPage = () => {
  // useSnsで管理しているロジックを取得
  const { addPost } = useSns()

  return (
    <div>
      <div>
        <h1>投稿</h1>
        <form onSubmit={addPost}>
          <div>
            <textarea id="post" name="post" placeholder="post" />
          </div>
          <div>
            <button>投稿</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPost
