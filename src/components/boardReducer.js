
import { createAction, createReducer } from '@reduxjs/toolkit'
import { boardState } from '~/apis/boardState'

//Tao Action
export const addCard = createAction('addCard')
export const updateCard = createAction('updateCard')
export const addColumn = createAction('addColumn')
export const deleteColumn = createAction('deleteColumn')
export const getBoard = createAction('getBoard')
export const updateUser = createAction('updateUser')
export const boardReducer = createReducer(boardState, (builder) => {
  builder
    .addCase(getBoard, (state, action) => {
      console.log('check van', { ...state, ...action.payload })
      //immerjs giup chung ta mutate an toan
      return { ...state, ...action.payload }

    })
    .addCase(addColumn, (state, action) => {
      state.columns.push({ ...action.payload, _id:action.payload._id.toString() })
      state.columnOrderIds.push(`${action.payload._id}`)
      //Không can return vi co co che immerjs
    })
    .addCase(deleteColumn, (state, action) => {
      const columns =state.columns.filter((column) => column._id !== action.payload._id)
      state.columnOrderIds = action.payload.columnOrderIds
      state.columns=columns
      //Không can return vi co co che immerjs
    })
    .addCase(addCard, (state, action) => {
      const column = state.columns.find((column) => column._id===action.payload.columnId.toString())
      //Vi khi tạo state ta không khai báo nên mặc định các thuộc tính là null nếu không có giá trị
      if (column.cards===null)
      {
        column.cards=[]
        column.cardOrderIds=[]
      }
      column.cards?.push(action.payload)
      column.cardOrderIds?.push(action.payload._id)
      //Không can return vi co co che immerjs
    })
    .addCase(updateUser, (state, action) => {
      return { ...state, 'listUsers':action.payload }
      //Không can return vi co co che immerjs
    })
    .addCase(updateCard, (state, action) => {
      const column = state.columns.find((column) => column._id === action.payload.columnId.toString())
      const cardID = column.cards.findIndex((card) => card._id === action.payload._id)
      column.cards[cardID] = action.payload

    })
})