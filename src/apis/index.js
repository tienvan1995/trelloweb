import axios from 'axios'
import { addCard, addColumn, deleteColumn, getBoard, updateCard, updateUser } from '~/components/boardReducer'
import { convertStringToLongArray, convertStringToStringArray } from '~/utils/formatters'

export const createUserAPI =async (userModel) => {
  try {
    const response = await axios.post('http://localhost:8081/users', userModel)
    console.log('User created:', response.data)
  } catch (error) {
    console.error('Error creating user:', error)
  }
}
//API getAllUser
export const getAllUserAPI =async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8081/users')
    dispatch(updateUser(response.data))
    console.log('get all User:', response.data)
  } catch (error) {
    console.error('Error get All User:', error)
  }
}

//API create newCard
export const createCardAPI =async (newCard, dispatch) => {
  try {
    const fetchData ={ ...newCard, columnId:typeof(newCard.columnId)==='string'? parseInt(newCard.columnId) : newCard.columnId }
    console.log('fetchData', fetchData)
    console.log('create Card', newCard)
    //Hinh nhu khong can convert columnid  sang kieu so
    const response = await axios.post('http://localhost:8081/card', fetchData)
    console.log('create Card', response.data)
    dispatch(addCard(response.data))
    //Luc dau khong co return khi gọi API khong lay dc du lieu ra
  } catch (error) {
    console.error('Error creating column:', error)
  }
}

//API  updateCard
export const updateCardAPI =async (updatedCard, dispatch) => {
  try {
    console.log('updatedCard', updatedCard)
    const taggedUser = updatedCard?.taggedUser?.map(id => ( { '_id': id } ))
    const comments = [{ 'content':updatedCard.comments }]
    const attachments =updatedCard?.attachments?.map(fileLink => ({ fileLink:fileLink }))
    const fetchData ={ ...updatedCard, taggedUser:taggedUser, comments:comments, attachments:attachments, loginUserId:3 }
    console.log('fetchData', fetchData)

    const response = await axios.put('http://localhost:8081/card', fetchData)
    console.log('updating Card', response.data)
    dispatch(updateCard(response.data))
  } catch (error) {
    console.error('Error Updating card:', error)
  }
}

//API sắp xếp
export const arangeBoardAPI =async (arangeData) => {
  try {
    const { columnMove, source, target, cardId } = arangeData
    const fetchData ={ columnMove, source, target, cardId }
    console.log('fetchData', fetchData)
    const response = await axios.put('http://localhost:8081/arrange', fetchData)
    console.log('updating Card', response.data)
  } catch (error) {
    console.error('Error Updating card:', error)
  }
}

//API  getCard
export const getCardAPI =async (cardId, dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8081/card/${cardId}`)
    const defaultValues = {
      'taggedUser': response.data.taggedUser!== null ? response.data.taggedUser.map(user => user._id): [],
      'comments':response.data.comments, //Tam để rỗng đợi làm giao diện hiển thị comment
      'description':response.data.description !== null ? response.data.description : '',
      'attachments':response.data.attachments !== null ? response.data.attachments.map((att) => att.fileLink):[],
      'image':response.data.image !== null ? response.data.image : ''
    }
    console.log('getting Card', response.data)
    console.log('getting Card', defaultValues)
    return defaultValues
    // dispatch(updateCard(response.data))
  } catch (error) {
    console.error('Error getting card:', error)
    return null
  }
}

//API create newColumn
export const createColumnAPI =async (newColumn, dispatch) => {
  try {
    console.log('Error creating column:', newColumn)
    const response = await axios.post('http://localhost:8081/column', newColumn)
    dispatch(addColumn(response.data))
    //Luc dau khong co return khi gọi API khong lay dc du lieu ra
    return response.data
  } catch (error) {
    console.error('Error creating column:', error)
    return null
  }
}
//API delete column
export const deleteColumnAPI =async (column, dispatch) => {
  const fetchData = { ...column, _id:parseInt(column._id), columnOrderIds:column.columnOrderIds.join(',') }
  try {
    const response = await axios.delete('http://localhost:8081/column', { params: fetchData })
    if (response.data) {
      dispatch(deleteColumn(column))
    }
    //Luc dau khong co return khi gọi API khong lay dc du lieu ra
  } catch (error) {
    console.error('Error deleting column:', error)
  }
}


//API get board
export const getBoardAPI =async (boardid, dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8081/board/${boardid}`)
    const dispatchData ={
      ...response.data,
      columnOrderIds:convertStringToStringArray(response.data.columnOrderIds),
      columns:response.data.columns.map((column) => ({ ...column, _id:`${column._id}`, cardOrderIds : convertStringToLongArray(column.cardOrderIds) }))
    }
    dispatch(getBoard(dispatchData))
  } catch (error) {
    console.error('Error getting board:', error)
  }
}

//Phan này test để biết method get không hỗ trợ gửi data muốn gửi phải thông qua params
/*
export const createBoardAPI =async (boardModel) => {
  console.log('parac:', boardModel)
  try {
    const response = await axios.get('http://localhost:8081/boardvan',
      { params: boardModel }
    )
    console.log('Create board:', response.data)
    return response.data
  } catch (error) {
    console.error('Error getting board:', error)
    return null
  }
}
*/
