import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import MemberItem from '@components/member_item';
import { useState } from 'react';
import { useAuthStore } from '@services/zustand/authStore';

interface HeaderControlsProps {}
export default function HeaderControls({}: HeaderControlsProps) {
  const user = useAuthStore((state) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header-controls">
      <MemberItem
        id="Admin account"
        name={`${user?.name}`}
        src={`${user?.avatar_url}?${new Date()}`}
        open={open}
        handleClick={handleClick}
      />
    </div>
  );
}
