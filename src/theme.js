import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT='58px'
const BOARD_BAR_HEIGHT='60px'
const BOARD_CONTENT_HEIGHT=`calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'
// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight:BOARD_BAR_HEIGHT,
    boardContentHeight:BOARD_CONTENT_HEIGHT,
    column_header_height:COLUMN_HEADER_HEIGHT,
    column_footer_height:COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    light: {},
    dark: {}
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'none',
          borderWidth:'0.001px',
          '&:hover':{ borderWidth:'0.001px' }
        }
      }
    },
    MuiInputLabel:{
      styleOverrides: {
        root:{ fontSize:'0.875rem' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root:({ theme }) => ({
          fontSize:'0.875rem',
          '.MuiOutlinedInput-notchedOutline':{
            borderColor:theme.palette.primary.main
          },
          '& fieldset':{
            borderWidth:'0.001px !important'
          },
          '&:hover fieldset':{
            borderWidth:'2px !important'
          },
          '&.Mui-focused fieldset':{
            borderWidth:'2px !important'
          }
        })
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body:  {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white' }
        }
      }
    },
    MuiTypography:{
      styleOverrides: {
        root:{
          '&.MuiTypography-body1':{ fontSize:'0.875rem' } }
      }
    }
  }
})

export default theme
