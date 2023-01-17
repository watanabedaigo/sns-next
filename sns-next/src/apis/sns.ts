import axios from 'axios'
import { JsonUserType } from 'types/JsonUserType'
import { PostType } from 'types/PostType'

// 型エイリアス
// 合併型
type allDataType = JsonUserType[] | PostType[]
type dataType = JsonUserType | PostType

// GET
export const getData = async (targetUrl: string) => {
  const response = await axios.get(targetUrl)
  const allData: allDataType = response.data
  return allData
}

// POST
export const postData = async (targetUrl: string, newPost: dataType) => {
  const response = await axios.post(targetUrl, newPost)
  const newData: dataType = response.data
  return newData
}

// PUT
export const putData = async (
  targetUrl: string,
  id: string,
  targetPost: dataType
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
