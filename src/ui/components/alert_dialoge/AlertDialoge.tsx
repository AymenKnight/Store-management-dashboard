import './style/index.scss';
import TextButton from '@components/buttons/text_button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import color from '@assets/styles/color';

interface AlertDialogeProps {
  open: boolean;
  name: string;
  deleteMutaion: () => void;
  onClose: () => void;
}
export default function AlertDialoge({
  open,
  name,
  deleteMutaion,
  onClose,
}: AlertDialogeProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete {name}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <TextButton
          text="Cancel"
          fontColor={color.good_black}
          fontWeight={600}
          padding={'8px 15px'}
          onPress={onClose}
        />

        <TextButton
          text="Delete"
          backgroundColor={color.hot_red}
          fontColor={color.white}
          padding={'8px 15px'}
          onPress={deleteMutaion}
        />
      </DialogActions>
    </Dialog>
  );
}
