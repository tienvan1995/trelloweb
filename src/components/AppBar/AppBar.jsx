import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as trelloLogo } from '~/assets/trelloicon.svg'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'

import Workspaces from './Menu/Workspaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import { InputAdornment, Tooltip } from '@mui/material'
import Profiles from './Menu/Profiles'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useState } from 'react'
function AppBar() {
  const [searchVal, setSearchVal] =useState('')
  const delet = () => {
    setSearchVal('')
  }
  const update = (event ) => {
    setSearchVal(event.target.value)
  }


  return (
    <Box sx={{
      px:1,
      width:'100%',
      height:(theme) => theme.trello.appBarHeight,
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap:2,
      overflowX: 'auto',
      bgcolor:(theme) => (theme.palette.mode==='dark' ? '#2c3e50':'#1565c0')
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <AppsIcon sx={{ color:'white' }}/>
        <Box sx={{ display:'flex', alignItems:'center', gap: 0.5 }}>
          <SvgIcon component={trelloLogo} inheritViewBox fontSize= 'small' sx={{ color: 'white' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
        </Box>
        <Box sx={{ display:{ xs:'none', md:'flex' }, gap:1 }}>
          <Workspaces/>
          <Recent/>
          <Starred/>
          <Templates/>
          <Button
            sx={{
              color:'white',
              border:'none',
              '&:hover':{
                border:'none'
              }
            }}
            variant="outlined"
            startIcon={
              <AddBoxIcon/>
            }>Create</Button>
        </Box>
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size='small'
          value={searchVal}
          onChange={update}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color:'white' }}/>
              </InputAdornment>
            ),
            endAdornment:(
              <ClearIcon
                fontSize='small'
                onClick={delet }
                sx={{
                  color: searchVal ? 'white': 'transparent', cursor:'pointer'
                }}/>

            )
          }}
          sx={{
            minWidth:'120px',
            maxWidth:'180px',
            '& label':{ color: 'white' },
            '& .MuiInputBase-root':{ color: 'white' },
            '& label.Mui-focused':{ color: 'white' },
            '& .MuiOutlinedInput-root':{
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor:'white' },
              '&.Mui-focused fieldset':{ borderColor:'white' }
            }
            // '& .MuiInputLabel-root':{
            //   color:'white'
            // },
            // '& .MuiInputBase-root':{
            //   color:'white'
            // },
            // '& .MuiOutlinedInput-notchedOutline':{
            //   borderColor:'white'
            // }
          }} />
        <ModeSelect/>
        <Tooltip title='Notification'>
          <Badge color="secondary" variant="dot" sx={{ cursor:'pointer' }}>
            <NotificationsNoneIcon sx={{ color:'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title='Help'>
          <HelpOutlineIcon sx={{ cursor:'pointer', color:'white' }} />
        </Tooltip>
        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
