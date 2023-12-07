import MenuOption from '@components/menu_option';
import './style/index.scss';
import Logo from 'toSvg/logo.svg';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import MenuDropdown from '@components/menu_dropdown';
import { routesData } from '@services/routes';
import { useState } from 'react';

interface AppMenuProps {}
export default function AppMenu({}: AppMenuProps) {
  const [isOpen, setisOpen] = useState();
  return (
    <div className="app-menu">
      <Logo width={180} height={50} />
      <div className="menu-container">
        {routesData.map((route, index) => (
          <div key={route.mainRouteName}>
            <MenuDropdown
              key={route.mainRouteName}
              mainRouteName={route.mainRouteName}
              mainRouteIcon={route.mainRouteIcon}
              routes={route.routes}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
