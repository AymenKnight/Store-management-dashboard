import * as React from 'react';
import './style/index.scss';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface PopoverTextProps {
  text: string;
  open: boolean;
  id: string;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

export default function PopoverText({
  text,
  open,
  id,
  anchorEl,
  handleClose,
}: PopoverTextProps) {
  return (
    <div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>{text}</Typography>
      </Popover>
    </div>
  );
}
