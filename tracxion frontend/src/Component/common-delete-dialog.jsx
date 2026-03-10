import { Dialog, DialogTitle, DialogContent, Grid, Box, IconButton, Alert } from '@mui/material';
import CommonButton from './common-button';

function CommonDeleteDialog({
  open,
  setOpen,
  title,
  description,
  handleSubmit,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      maxWidth="sm"
      fullWidth={true}
      PaperProps={{
        style: {
          borderRadius: '1rem',
          padding: '1%',
        }
      }}
    >
      <DialogTitle>
        <span className='dialog-title'>{title}</span>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen(false)
          }}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
          }}
        >
          <img src="/cross-icon.svg" alt="" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3, pt: 2 }} style={{
        overflowX: 'hidden',
      }}>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#172B4D',
            margin: '0%',
          }}>{description}</h2>
        </div>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: '2%',
          justifyContent: 'end',
          alignItems: 'center',
          width: '100%',
        }}>
          <CommonButton
            backgroundColor="transparent"
            textColor="#172B4D"
            onClick={() => {
              setOpen(false)
            }}
            text="Cancel"
            borderColor={"transparent"}
          />

          <CommonButton
            text={"Delete"}
            backgroundColor={"#00A1F9"}
            textColor={"#FFFFFF"}
            borderColor={"#00A1F9"}
            onClick={() => {
              handleSubmit()
              setOpen(false)
            }}
          />
        </Box>

      </DialogContent>
    </Dialog>
  );
}

export default CommonDeleteDialog;