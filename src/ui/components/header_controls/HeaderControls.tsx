import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import { BellIcon } from '@heroicons/react/24/solid';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import color from '@assets/styles/color';
import MemberItem from '@components/member_item';
import AdminProfileMenu from '@components/admin_profile_menu';
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
      {/* <TextButton
        width={35}
        Icon={<EnvelopeIcon fill={color.text_gray} />}
        padding={5}
      />
      <TextButton
        width={35}
        Icon={<BellIcon fill={color.text_gray} />}
        padding={5}
        css={{
          position: 'relative',
        }}
      >
        <div className="bell-red-circle" />
      </TextButton> */}
      <MemberItem
        id="Admin account"
        name={`${user?.name}`}
        src={`${user?.avatar_url}?${new Date()}`}
        open={open}
        handleClick={handleClick}
      />
      <AdminProfileMenu
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </div>
  );
}
