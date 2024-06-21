import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Avatar, AvatarGroup, Box, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputLabel, List, ListItem, ListItemText, MenuItem, Card as MuiCard, OutlinedInput, Select, TextField, Tooltip } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import ReactModal from 'react-modal'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EditNoteIcon from '@mui/icons-material/EditNote'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DehazeIcon from '@mui/icons-material/Dehaze'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { includes } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getCardAPI, updateCardAPI } from '~/apis'


const customStyles = {

  content: {
    padding:'0px',
    borderColor: '#bfc2cf',
    borderWidth: '3px',
    // borderStyle: 'solid',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
//XỬ lý phần thêm thành viên
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    //Thay doi đầu vào id để ID của Card và column không chùng nhau.Nếu chùng nó kéo ưu tiên phần tử to
    id: card._id,
    data:{ ...card }
  })
  const dndCardStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity:isDragging? 0.5:undefined
  }
  const shouldShowCardAction= () => { return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length}
  const dispatch =useDispatch()
  //Lấy danh sách user trong state để hiển thị
  const listUsers = useSelector((state) => state.boardReducer.listUsers)
  //console.log('listUsers', listUsers)
  const [listComments, setListComment] = useState([])
  const [showMore, setShowMore] = useState(false)
  const openShoWMore = () => {
    setShowMore(true)
  }
  const closeShoWMore = () => {
    setShowMore(false)
  }
  //Xử lý chọn ảnh

  const [draftImage, setDraftImage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const imagePreview = () => {
    if (draftImage!==selectedImage) {
      setSelectedImage(draftImage)}
  }

  const [files, setFiles] = useState([])

  const handleChangefile = (event) => {
    const selectedFiles = event.target.files
    //Ở đây t phải tách ra để return gửi ra hook form chứ không return state files vì luc này nó chưa cập nhật kịp
    const listfilename =[...files, ...Array.from(selectedFiles).map((file) => file.name)]
    setFiles(listfilename)
    return listfilename
  }


  //Xử lý React hook Form
  const { control, register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm({
    defaultValues: {
      taggedUser: [],
      comments :'',
      description:'',
      image:''
    }

  })

  //Xử lý thêm thành viên
  const [personName, setPersonName] = useState(getValues('taggedUser'))
  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    console.log('handleChange', value)
    console.log('personName', personName)
    setPersonName(value
      // On autofill we get a stringified value.
      // typeof value.userName === 'string' ? value.split(',') : value
    )

  }

  //XỬ lý hiển thị CardModal
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal= () => {
    setIsOpen(true)
    getCardAPI(card._id, dispatch).then((re) =>
    { setValue('taggedUser', re.taggedUser)
      setValue('description', re.description)
      setValue('attachments', re.attachments)
      setValue('image', re.image)
      setListComment(re.comments)
      setSelectedImage(re.image)
      setDraftImage(re.image)
      setFiles(re.attachments)
      setPersonName(re.taggedUser)
    } )
    console.log('data', personName)
  }
  const closeModal= () => {
    setIsOpen(false)
    reset()
    //setPersonName(getValues('taggedUser'))
  }

  const onSubmit = (data) => {
    // Xử lý logic submit form
    updateCardAPI({ ...data, _id:card._id }, dispatch)
    closeModal()
    console.log(data)
    reset()
    //setPersonName(getValues('taggedUser'))
  }
  return (
    <>
      <MuiCard onClick={openModal} sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        '&:hover': {
          borderColor: '#bfc2cf',
          borderWidth: '1.5px',
          borderStyle: 'solid'
        }
      }}
      ref={setNodeRef}
      style={dndCardStyle}
      {...attributes}
      {...listeners}
      >
        {card?.image &&
        <CardMedia
          sx={{ height: 140 }}
          image={card?.image}
          title="Nguyen Tien Van" />}
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography> {card?.title}</Typography>
        </CardContent>
        {shouldShowCardAction() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.taggedUser?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.taggedUser?.length}</Button>}
          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
        </CardActions>}
      </MuiCard>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        appElement={document.body}
        style={customStyles}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              p:'15px',
              bgcolor:(theme) => (theme.palette.mode==='dark' ? '#333643':'#ebecf0')
            }}
            data-no-dnd='true'>
            <Box sx={{
              maxWidth:'700px',
              minWidth:'700px',
              display:'flex',
              alignItems:'center',
              gap:2
            }}>
              <CreditCardIcon fontSize='medium'/>
              <Typography variant='h5'> {card.title}</Typography>
            </Box>
            <Box
              sx={{
                maxHeight:'550px',
                minHeight:'550px',
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                overflow:'auto'
              }} >
              <Box
                sx={{ minWidth:'500px',
                  maxWidth:'500px' }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                  <EditNoteIcon fontSize='medium'/>
                  <Typography variant='h6'>Mô Tả</Typography>
                </Box>
                <TextField
                  sx={{
                    width:'100%',
                    marginTop:3
                  }}
                  multiline
                  rows={3}
                  variant='outlined'
                  label="Thêm mô tả chi tiết hơn..."
                  InputLabelProps={{
                    shrink: true
                  }}
                  type="text"
                  {...register('description')}
                />
                <Box sx={{ display:'flex', alignItems:'center', gap:2, marginTop:2 }}>
                  <CheckBoxIcon fontSize='medium'/>
                  <Typography variant='h6'>Danh sách công việc</Typography>
                </Box>
                <FormGroup sx={{ px:4 }}>
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Công việc 1" />
                  <FormControlLabel control={<Checkbox />} label="Công việc 1" />
                  <FormControlLabel control={<Checkbox />} label="Công việc 1" />
                </FormGroup>
                <Button variant='contained' color='success' size='small'
                  sx={{
                    mx:4,
                    color:'white',
                    boxShadow:'none',
                    border:'0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
                  }}>
            Thêm một mục
                </Button>
                <Box sx={{ display:'flex', alignItems:'center', gap:2, marginTop:2 }}>
                  <DehazeIcon fontSize='medium'/>
                  <Typography sx={{ paddingBottom:0.5 }} variant='h6'>Hoạt động</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:1, marginTop:2 }}>
                  <Tooltip title='tien van'>
                    <Avatar
                      sx={{ width: 35, height: 35 }}
                      alt='nguyen tien van'
                      src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
                  </Tooltip>
                  <TextField
                    sx={{
                      width:'100%'
                    }}
                    size='small'
                    variant='outlined'
                    label="Viết bình luận..."
                    type="text"
                    multiline
                    {...register('comments')}
                  />
                </Box>
                {!showMore
                  ?<Button onClick={openShoWMore} sx={{
                    marginLeft:5,
                    display: !listComments? 'none' : 'block'
                  }}
                  >Xem thêm... </Button>
                  :
                  <Box>
                    <Box sx={{
                      marginTop:1,
                      //minHeight:'100px',
                      maxHeight:'100px',
                      overflow:'auto'
                    }}>
                      <List>

                        {listComments?.map((cmt) => {
                          var cmtuser = listUsers.filter((user) => user._id === cmt.userId)
                          return (
                            <ListItem
                              sx={{
                                display:'flex', alignItems:'center', gap:1, marginTop:0
                              }}
                              key={cmt._id}>
                              <Tooltip title= {cmtuser[0].userName}>
                                <Avatar
                                  sx={{ width: 25, height: 25 }}
                                  alt={cmtuser[0].userName}
                                  src={cmtuser[0].avatar} />
                              </Tooltip>
                              <ListItemText primary={cmt.content} />
                            </ListItem>)}
                        )}
                      </List>
                    </Box>
                    <Button sx={{ marginLeft:2 }} onClick={closeShoWMore}>...Thu gọn</Button>
                  </Box>
                }

              </Box>
              <Box
                sx={{ minWidth:'192px',
                  maxWidth:'192px' }}
              >
                <Typography variant='h6' sx={{ color:'#757575' }} align='center'>Thêm vào thẻ</Typography>
                <Box sx={{
                  bgcolor:(theme) => (theme.palette.mode==='dark' ? '#5f5b5b':'#dde0ee')
                }}>
                  <Box sx={{
                    marginTop:2,
                    display:'flex',
                    alignItems:'center',
                    gap:0,
                    p:0.5

                  }}
                  >
                    <PersonOutlineIcon/>
                    <FormControl size='small' sx={{ m: 1, width:'100%' }}>
                      <InputLabel id="demo-multiple-checkbox-label">Thêm thành viên</InputLabel>
                      <Select
                        {...register('taggedUser')}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput label="Thêm thành viên" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {listUsers?.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            <Checkbox checked={personName.indexOf(user._id) > -1} />
                            <ListItemText primary={user.userName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <AvatarGroup
                    max={4}
                    sx={{
                      paddingBottom:1,
                      minHeight:'40px',
                      maxHeight:'40px',
                      gap:'10px',
                      cursor:'pointer',
                      justifyContent:'center',
                      // vi phần tử con nằm trong class con của cha
                      '& .MuiAvatar-root': {
                        height:'30px',
                        width:'30px',
                        fontSize:'16px',
                        border:'none',
                        ':first-of-type':{ bgcolor:'#a4b0be' }
                      }
                    }}>
                    {listUsers.map((user) => ((personName.includes(user._id))&&
                      <Tooltip title={user.userName} key={user._id}>
                        <Avatar
                          alt={user.userName}
                          src={user.avatar} />
                      </Tooltip>
                    ))}

                  </AvatarGroup>
                </Box>
                <Box>
                  <Controller
                    name="attachments"
                    control={control}
                    render={({ field }) => (
                      <Button
                        {...field}
                        sx={{
                          marginTop:1,
                          color:(theme) => (theme.palette.mode==='dark' ? '#e0e0e0':'#757575'),
                          width:'100%',
                          justifyContent:'space-between',
                          bgcolor:(theme) => (theme.palette.mode==='dark' ? '#5f5b5b':'#dde0ee'),
                          borderBottom:'solid 0.005px',
                          boxShadow:'none',
                          '&:hover':{ bgcolor:(theme) => (theme.palette.mode==='dark' ? '#5f5b5b':'#dde0ee') }
                        }}
                        startIcon={<AttachmentIcon/>}
                        variant="contained"
                        component="label"
                        multiple
                        //o day toi dung button kieu file de lay file
                        //type="file"
                        onChange={(e) => field.onChange(handleChangefile(e)) }
                      >
                    Đính Kèm
                        <Input sx={{ display:'none' }} type="file">  </Input>
                      </Button>)}
                  />
                  <Box sx={{
                    maxHeight:'100px',
                    minHeight:'100px',
                    overflow:'auto',
                    bgcolor:(theme) => (theme.palette.mode==='dark' ? '#5f5b5b':'#dde0ee')
                  }}>
                    <List>
                      {files?.map((fileName) => (
                        <ListItem key={fileName + Math.random()} value = {fileName} >
                          <ListItemText primary={fileName} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop:1,
                    bgcolor:(theme) => (theme.palette.mode==='dark' ? '#5f5b5b':'#dde0ee'),
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    gap:0.5
                  }}>
                  <Box sx={{
                    width:'100%',
                    justifyContent:'space-between',
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
                      {...register('image')}
                      variant='outlined'
                      label="Thay anh the"
                      type="text"
                      size='small'
                      InputLabelProps={{
                        shrink: true
                      }}
                      onChange={(e) => {setDraftImage(e.target.value)}}
                    />
                    <Button onClick={imagePreview} variant='contained' color='success' size='small'
                      sx={{
                        color:'white',
                        boxShadow:'none',
                        border:'0.5px solid',
                        borderColor: (theme) => theme.palette.success.main,
                        '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
                      }}>
                    Preview...
                    </Button>
                  </Box>

                  {selectedImage && <img
                    //src={URL.createObjectURL(selectedImage)}
                    src={selectedImage}
                    alt="Ảnh mô tả"
                    width="115" // Chiều rộng ảnh
                    height="100" // Chiều cao ảnh
                  />}
                </Box>
              </Box>
            </Box>
            <Box sx={{
              display:'flex',
              justifyContent:'center',
              gap:6
            }}>
              <Button sx={{
                marginTop:2,
                boxShadow:'none',
                border:'0.5px solid',
                borderColor: (theme) => theme.palette.success.main
                // '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
              }}
              type="submit"
              >Save</Button>
              <Button onClick={closeModal } sx={{
                marginTop:2,
                boxShadow:'none',
                border:'0.5px solid',
                borderColor: (theme) => theme.palette.success.main
                // '&:hover':{ bgcolor:(theme) => theme.palette.success.main }
              }}>Cancel</Button>
            </Box>
          </Box>
        </form>
      </ReactModal>
    </>
  )
}

export default Card
