/* eslint-disable indent */
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Tooltip from '@mui/material/Tooltip'
import DeleteForever from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { sortByArrayOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import ClearIcon from '@mui/icons-material/Clear'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'

import DeleteAlert from '~/components/Alert/DeleteAlert'
import { createCardAPI, deleteColumnAPI } from '~/apis'
import { useDispatch } from 'react-redux'

function Column({ column, setvanflag, vanflag, columnOrderIds }) {
  //xu ly phan xổ more
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //Xử lý phần cảnh báo xóa
  const [openAlert, setOpenAlert] = useState(false)
  const handleOpenAlert = () => {
    setOpenAlert(true)
  }
  const handleCloseAlert = () => {
    setOpenAlert(false)
    setAnchorEl(null)
  }
  const dispatch =useDispatch()
  const removeColumn = () => {
    console.log('columnOrderIds', columnOrderIds)
    const clonedata =cloneDeep(columnOrderIds)
    clonedata.splice(columnOrderIds.indexOf(column._id), 1)
    deleteColumnAPI({ '_id':column._id, 'boardId':column.boardId, 'columnOrderIds':clonedata }, dispatch)
    setOpenAlert(false)
    setAnchorEl(null)
  }
  
  const orderCards = sortByArrayOrder(column.cards, '_id', column.cardOrderIds)

  //Xử lý phần thêm card
  const [showAddNewCardButton, setShowAddNewCardButton] = useState(false)
  useEffect(() => {
    if (column._id!=vanflag) {
      setShowAddNewCardButton(false)}
  }, [column, vanflag] )
  const toggleShowAddCard = () => {
    setShowAddNewCardButton(!showAddNewCardButton)
    setvanflag(column._id)
  }

  const [newCard, setNewCard] = useState('')
  const addNewCard = () => {
    if (!newCard) {
      toast.error('Hay nhap title card')
      return
    }
    //goi API luu card
    createCardAPI({ 'title':newCard, 'boardId':column.boardId, 'columnId':column._id }, dispatch)

    // reset lại newColumn và showAddNewColumnButton
    //chú ý NewColumn không được để null vị text value được gan bởi biến này không cho phép null
    setNewCard('')
    toggleShowAddCard()
  }
  //Kết thúc xử lý thêm card
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
     id: column._id,
     data:{ ...column },
     disabled:false
     })
  const dndColumnStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height:'100%',
    opacity:isDragging? 0.5:undefined
  }

  return (
    <div ref={setNodeRef} style={dndColumnStyle} {...attributes} >
      <Box sx={{
        minWidth:'300px',
        maxWidth:'300px',
        bgcolor:(theme) => (theme.palette.mode==='dark' ? '#333643':'#ebecf0'),
        borderRadius:'6px',
        ml:2,
        height:'fit-content',
        maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
      }}
      {...listeners}
      >
        {/* column header */}
        <Box sx={{
          height:(theme) => theme.trello.column_header_height,
          p:2,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>
          <Typography sx={{ fontWeight:'bold', cursor:'pointer' }}>
            {column.title}
          </Typography>
          <Box>
            <Tooltip title="More Option">
              <KeyboardArrowDownIcon
                sx={{ color:'text.primary', cursor:'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleOpenAlert}>
                <ListItemIcon><DeleteForever fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
                <DeleteAlert openAlert={openAlert} handleAlertClose={handleCloseAlert} removeColumn={removeColumn}/>
          </Box>
        </Box>
        {/* column list card */}
        <ListCards cards={orderCards}/>
        {/* Column footer */}
        {!showAddNewCardButton
        ? <Box onClick={toggleShowAddCard}
         sx={{
          height:(theme) => theme.trello.column_footer_height,
          p:2,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>
          <Button startIcon={<AddCardIcon/>}>Add new card</Button>
          <Tooltip title="Drag to move">
            <DragHandleIcon sx={{ cursor:'pointer' }}/>
          </Tooltip>
        </Box>
        :
       <Box sx={{
            height:'fit-content',
            borderRadius:'6px',
            mx:0.5,
            p:1,
            display:'flex',
            //flexDirection:'column',
            gap:1
          }}>
            <TextField
            data-no-dnd='true'
              variant='outlined'
              label="Add Card Title"
              type="text"
              size='small'
              value={newCard}
              autoFocus
              onChange={(e) => setNewCard(e.target.value)}
              sx={{
                '& label':{ color: 'text.primary' },
                '& input':{
                   color: (theme) => theme.palette.primary.main,
                   bgcolor:(theme) => theme.palette.mode==='dark'? '#333643':'white'
                   },
                '& label.Mui-focused':{ color: (theme) => theme.palette.primary.main },
                '& .MuiOutlinedInput-root':{
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&:hover fieldset': { borderColor:(theme) => theme.palette.primary.main },
                  '&.Mui-focused fieldset':{ borderColor:(theme) => theme.palette.primary.main }
                }
              }} />
            <Box sx={{ display: 'flex', alignItems:'center', gap:1 }}>
              <Button onClick={addNewCard} variant='contained' color='success' size='small'
                sx={{
                  color:'white',
                  boxShadow:'none',
                  border:'0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
                }}>
            Add
              </Button>
              <ClearIcon
                onClick={toggleShowAddCard}
                sx={{
                  cursor:'pointer',
                  color:(theme) => theme.palette.warning.light
                }}/>
            </Box>
          </Box>
        }
      </Box>
    </div>
  )
}

export default Column
