import { Box, Button, SvgIcon, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ReactComponent as trelloLogo } from '~/assets/trelloicon.svg'
function LoginForm({ offLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = (data) => {
    // Xử lý logic submit form
    offLogin()
    console.log(data)}
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100vh' }} >
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 400, // Thay đổi width
        height: 400, // Thay đổi height
        padding: 30, // Thay đổi padding
        border: '2px solid #ccc', // Thay đổi border
        borderRadius: 15, // Thay đổi borderRadius
        backgroundColor:'#a8d6eb', // Thêm background
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Thêm boxShadoư
      }} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{
          paddingBottom:2,
          display:'flex',
          alignItems:'center',
          gap: 0.5 }}>
          <SvgIcon component={trelloLogo} inheritViewBox fontSize= 'large' sx={{ color: 'white' }} />
          <Typography variant='h4' sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#03a9f4' }}>Trello</Typography>
        </Box>
        <Typography variant='h4' sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333643', paddingBottom:3 }}>LOGIN</Typography>
        <TextField sx={{
          paddingBottom:3,
          '& label':{ color: '#333643' },
          '& .MuiInputBase-root':{ color: 'white' },
          '& label.Mui-focused':{ color: '#333643' },
          '& .MuiOutlinedInput-root':{
            '& fieldset': { borderColor: '#4fc3f7' },
            '&:hover fieldset': { borderColor:'#4fc3f7' },
            '&.Mui-focused fieldset':{ borderColor:'#4fc3f7' }
          }
        }}
        {...register('username', { required: true })}
        label="Tên đăng nhập"
        error={!!errors?.username}
        helperText={!!errors?.username && (
          <span>*Hãy nhập Username</span>
        )}
        />
        <TextField sx={{
          paddingBottom:3,
          '& label':{ color: '#333643' },
          '& .MuiInputBase-root':{ color: 'white' },
          '& label.Mui-focused':{ color: '#333643' },
          '& .MuiOutlinedInput-root':{
            '& fieldset': { borderColor: '#4fc3f7' },
            '&:hover fieldset': { borderColor:'#4fc3f7' },
            '&.Mui-focused fieldset':{ borderColor:'#4fc3f7' }
          }
        }}
        {...register('password', { required: true })}
        label="Mật khẩu"
        type="password"
        error={!!errors?.password}
        helperText={!!errors?.password && <span>*Hãy nhập Password</span>}
        />
        <Button
          // onClick={offLogin}
          type="submit" variant="contained" color="primary">
            Đăng nhập
        </Button>
      </form>
    </Box>
  )
}
export default LoginForm
