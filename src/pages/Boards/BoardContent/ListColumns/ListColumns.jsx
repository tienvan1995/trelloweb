
import Button from '@mui/material/Button'
import Column from './Column/Column'
import Box from '@mui/material/Box'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { toast } from 'react-toastify'
import { createColumnAPI } from '~/apis'
import { useDispatch } from 'react-redux'

function ListColumns({ columns, boardId, columnOrderIds }) {
  const initialColumn = {
    'boardId': boardId,
    'title': ''
  }
  const [vanflag, setvanflag] = useState('')
  const [newColumn, setNewColumn] = useState(initialColumn)
  const dispatch =useDispatch()
  const addNewColumn = () => {
    if (!newColumn.title) {
      toast.error('Hay nhap title column')
      return
    }
    //goi API luu column
    createColumnAPI(newColumn, dispatch).then(data => console.log('du lieu tra ve', data ) )

    // reset lại newColumn và showAddNewColumnButton
    //chú ý NewColumn không được để null vị text value được gan bởi biến này không cho phép null
    setNewColumn(initialColumn)
    toggleShowAddColumn()
  }
  const [showAddNewColumnButton, setShowAddNewColumnButton] = useState(false)
  const toggleShowAddColumn = () => {
    setShowAddNewColumnButton(!showAddNewColumnButton)
  }
  return (
    <SortableContext
      items={columns.map(c => c._id)}
      strategy={horizontalListSortingStrategy}>

      <Box sx={{
        bgcolor:'inherit',
        width:'100%',
        height:'100%',
        display:'flex',
        overflowX:'auto',
        overflowY:'hidden',
        '&::-webkit-scrollbar-track': {
          m: 1
        }
      }}>
        {columns?.map(column => <Column setvanflag={setvanflag} vanflag={vanflag} key={column._id } column={column} columnOrderIds={columnOrderIds}/>)}
        {!showAddNewColumnButton
          ? <Box onClick={toggleShowAddColumn} sx= {{
            minWidth:'250px',
            maxWidth:'250px',
            height:'fit-content',
            bgcolor:'#ffffff3d',
            borderRadius:'6px',
            mx:1
          }
          }>
            <Button startIcon={<NoteAddIcon/>}
              sx={{
                color:'white',
                width:'100%',
                justifyContent:'flex-start',
                pl:2,
                py:1,
                '& .MuiButton-startIcon':{ mr:1 }
              }}>
            Add new column
            </Button>
          </Box>
          :
          <Box sx={{
            minWidth:'250px',
            maxWidth:'250px',
            height:'fit-content',
            bgcolor:'#ffffff3d',
            borderRadius:'6px',
            mx:2,
            p:1,
            display:'flex',
            flexDirection:'column',
            gap:1
          }}>
            <TextField
              variant='outlined'
              label="Add Column Title"
              type="text"
              size='small'
              value={newColumn.title}
              autoFocus
              onChange={(e) => setNewColumn({ ...newColumn, title: e.target.value })}
              sx={{
                '& label':{ color: 'white' },
                '& .MuiInputBase-root':{ color: 'white' },
                '& label.Mui-focused':{ color: 'white' },
                '& .MuiOutlinedInput-root':{
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor:'white' },
                  '&.Mui-focused fieldset':{ borderColor:'white' }
                }
              }} />
            <Box sx={{ display: 'flex', alignItems:'center', gap:1 }}>
              <Button onClick={addNewColumn} variant='contained' color='success' size='small'
                sx={{
                  color:'white',
                  boxShadow:'none',
                  border:'0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
                }}>
            Add column
              </Button>
              <ClearIcon
                onClick={toggleShowAddColumn}
                sx={{
                  cursor:'pointer',
                  color:'white',
                  '&:hover':{ color:(theme) => theme.palette.warning.light }
                }}/>
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
