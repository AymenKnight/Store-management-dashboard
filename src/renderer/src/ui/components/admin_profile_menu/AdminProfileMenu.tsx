// interface AdminProfileMenuProps {}
// export default function AdminProfileMenu({}: AdminProfileMenuProps) {
//   return <div className="admin-profile-menu"></div>;
// }

import './style/index.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import CircleAvatar from '@components/circle_avatar';
import Header from '@components/header';
import Logout from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import UpdateAdminDrawer from '@components/update_admin_drawer';
import { User } from '@services/dataTypes';
import { useAuthStore } from '@services/zustand/authStore';

interface AdminProfileMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export default function AdminProfileMenu({
  anchorEl,
  open,
  handleClose,
}: AdminProfileMenuProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClickOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // const clickToggle = () => {
  //   handleClickOpenDrawer();
  //   // handleClose();
  // };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className="menu-header">
          <div className="menu-header-content">
            <CircleAvatar
              width={70}
              alt={`${user?.name}`}
              src={`${user?.avatar_url}?${new Date()}`}
            />
            <Header
              title={{
                text: `${user?.name}`,
                fontColor: 'black',
                fontSize: 22,
                fontWeight: 'bold',
              }}
            />
            <p>{user?.email}</p>
          </div>
        </div>
        <MenuItem
          onClick={() => {
            handleClickOpenDrawer();
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit your informations
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <UpdateAdminDrawer
        openDrawer={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
      />
    </>
  );
}
