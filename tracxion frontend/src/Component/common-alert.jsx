import { Alert } from "@mui/material";

const CommonAlert = ({ msg }) => {
  return (
    <Alert severity="error" sx={{ marginTop: '10px', marginBottom: '10px' }}>{
      msg instanceof Array ? <ul style={{ paddingLeft: '10px' }}>{msg.map((m) => <li style={{ listStyleType: 'none' }} key={m}>{m}</li>)}</ul> : msg
    }</Alert>
  );
};

export default CommonAlert;