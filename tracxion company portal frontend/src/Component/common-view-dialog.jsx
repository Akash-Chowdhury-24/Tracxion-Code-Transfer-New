import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";


function CommonViewDialog({
  open,
  setOpen,
  title,
  content,
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
          flexDirection: 'row',
          columnGap: '2%',
          alignItems: 'center',
        }}>
          <img src={content?.image} alt="" style={{
            width: '120px',
            height: '120px',
            borderRadius: '0.5rem',
            objectFit: 'contain',
          }}/>
          <div>
            {
              content?.description?.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '2%',
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#172B4D',
                    margin: '0%',
                    textWrap: 'nowrap',
                  }}>{item?.title} : </h2>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#172B4D',
                    margin: '0%',
                  }}>{item?.value}</p>
                </div>
              ))
            }
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonViewDialog;