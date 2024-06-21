import { configureStore } from '@reduxjs/toolkit'
import { boardReducer } from './components/boardReducer'
export const store = configureStore({
  reducer:{ boardReducer }
})