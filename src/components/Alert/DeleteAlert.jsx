import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
function DeleteAlert({ openAlert, handleAlertClose, removeColumn }) {

  return (
    <Dialog
      open={openAlert}
      onClose={handleAlertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Use Google\'s location service?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAlertClose}>Disagree</Button>
        <Button onClick={removeColumn} autoFocus>
              Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default DeleteAlert