import CircleAvatar from '@components/circle_avatar';
import './style/index.scss';
import Popover from '@mui/material/Popover';
import Header from '@components/header';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Student, Teacher } from '@services/dataTypes';

type User = Student | Teacher;

interface UserProfilePopupProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  id: string | undefined;
  user: User;
  handleClose: () => void;
}
export default function UserProfilePopup({
  open,
  anchorEl,
  id,
  user,
  handleClose,
}: UserProfilePopupProps) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <div className="container">
        <div className="close-icon" onClick={handleClose}>
          <XMarkIcon />
        </div>
        <div className="user-card-header">
          <CircleAvatar
            width={100}
            alt={`${user?.name}`}
            src={user?.avatar_url}
          />
          <Header
            title={{
              text: `${user?.name}`,
              fontColor: 'black',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          />
        </div>
        <div className="user-card-body">
          <div className="email">
            <p>Email</p>
            <p>{user?.email}</p>
          </div>
          <div className="phone">
            <p>Phone</p>
            <p>0123345678</p>
          </div>
        </div>
        <div className="user-card-actions"></div>
      </div>
    </Popover>
  );
}
