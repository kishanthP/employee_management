import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { JitsiMeeting as JitsiReactMeeting } from '@jitsi/react-sdk';

function JitsiMeeting({ open, roomName, onClose }) {
  const { user } = useSelector((state) => state.auth);

  if (!open || !roomName) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Video Meeting
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
        <JitsiReactMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false
          }}
          userInfo={{
            displayName: user?.name || 'Guest',
            email: user?.email || ''
          }}
          getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default JitsiMeeting;
