import axios from 'axios'
import { UsersType } from 'types/UsersType'
import { PostsType } from 'types/PostsType'

// 型エイリアス
// 合併型
type allDataType = UsersType[] | PostsType[]
type dataType = UsersType | PostsType

// APIリクエスト先のURL
// const usersUrl = 'http://localhost:3001/users'
// const postsUrl = 'http://localhost:3001/posts'

// GET
export const getData = async (targetUrl: string) => {
  const response = await axios.get(targetUrl)
  const allData: allDataType = response.data
  return allData
}

// POST
export const postData = async (targetUrl: string, newPost: PostsType) => {
  const response = await axios.post(targetUrl, newPost)
  const newData: dataType = response.data
  return newData
}

// PUT
export const putData = async (
  targetUrl: string,
  id: string,
  targetPost: PostsType
) => {
  const response = await axios.put(`${targetUrl}/${id}`, targetPost)
  const updatedData: dataType = response.data
  return updatedData
}

// DELETE
export const deleteData = async (targetUrl: string, id: string) => {
  const response = await axios.delete(`${targetUrl}/${id}`)
  const deletedData: dataType = response.data
  return deletedData
}
