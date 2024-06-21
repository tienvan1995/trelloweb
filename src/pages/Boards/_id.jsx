import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { createUserAPI, getAllUserAPI, getBoardAPI } from '~/apis'
import { userModel } from '~/apis/userModel'
import { useDispatch, useSelector } from 'react-redux'

function Board() {
  /* const [user,setUser] =useState(null)
  useEffect(() => {
  //call API
    createUserAPI(userModel).then(userDTO => {
      setUser(userDTO)
    })
  }, []) */
  const dispatch = useDispatch()
  const boardId = 1
  useEffect(() => {
    //call API
    getBoardAPI(boardId, dispatch)
    getAllUserAPI(dispatch)
  }, [])

  const board1 = useSelector((state) => state.boardReducer)
  console.log('board1', board1)
  return (
    <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
      <AppBar/>
      {/*mockData.board
         board1*/}
      <BoardBar board={board1}/>
      <BoardContent board={board1}/>
    </Container>
  )
}

export default Board
