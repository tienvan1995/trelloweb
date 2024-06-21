import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Button, Tooltip } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { capitalizeFirstLetter } from '~/utils/formatters'
function BoardBar({ board }) {
  const chipStyle={
    paddingX:'2px',
    color:'white',
    background: 'transparent',
    border:'none',
    borderRadius:'4px',
    '& .MuiSvgIcon-root':{
      color: 'white'
    },
    '&:hover':{
      backgroundColor:'primary.50'
    }

  }
  return (
    <Box sx={{
      width:'100%',
      height:(theme) => theme.trello.boardBarHeight,
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      paddingX:'8px',
      gap:2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor:(theme) => (theme.palette.mode==='dark' ? '#34495e':'#1976d2')
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <Chip
          icon={<DashboardIcon />}
          label={board.title}
          clickable= {true}
          sx={chipStyle}
        />
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board.type)}
          clickable= {true}
          sx={chipStyle}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable= {true}
          sx={chipStyle}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable= {true}
          sx={chipStyle}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filter"
          clickable= {true}
          sx={chipStyle}
        />
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <Button
          sx={{
            color:'white',
            borderColor:'white',
            '&:hover':{ borderColor:'white' }
          }}
          variant="outlined"
          startIcon={<PersonAddAltIcon/>}
        >
            Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap:'10px',
            cursor:'pointer',
            // vi phần tử con nằm trong class con của cha
            '& .MuiAvatar-root': {
              height:'30px',
              width:'30px',
              fontSize:'16px',
              border:'none',
              ':first-of-type':{ bgcolor:'#a4b0be' }
            }
          }}>
          <Tooltip title='tien van'>
            <Avatar
              alt='nguyen tien van'
              src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
          </Tooltip>
          <Tooltip title='tien van'>
            <Avatar
              alt='nguyen tien van'
              src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
          </Tooltip>
          <Tooltip title='tien van'>
            <Avatar
              alt='nguyen tien van'
              src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
          </Tooltip>
          <Tooltip title='tien van'>
            <Avatar
              alt='nguyen tien van'
              src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
          </Tooltip>
          <Tooltip title='tien van'>
            <Avatar
              alt='nguyen tien van'
              src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar
