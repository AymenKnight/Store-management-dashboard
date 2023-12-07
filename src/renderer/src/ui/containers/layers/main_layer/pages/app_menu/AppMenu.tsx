import './style/index.scss';
import Logo from 'toSvg/logo.svg';
import MenuDropdown from '@components/menu_dropdown';
import { routesData } from '@services/routes';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MenuOption from '@components/menu_option';
import { FaCircle } from 'react-icons/fa';

interface AppMenuProps {}
export default function AppMenu({}: AppMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const location = useLocation();
  const pathname = location.pathname.split('/');
  const navigate = useNavigate();
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
              setIsListShown={() => setSelectedIndex(index)}
              selected={index === selectedIndex}
              mainRouteSelected={
                location.pathname === '/' && index === 0
                  ? true
                  : routesData.some((rd) => {
                      if (
                        route.routes &&
                        route.mainRouteName == rd.mainRouteName
                      ) {
                        return route.routes.some((r) => {
                          return r.path === pathname[pathname.length - 1];
                        });
                      }
                    })
              }
            >
              {route.routes?.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: index * 0.1,
                  }}
                >
                  <MenuOption
                    key={index}
                    name={route.name}
                    Icon={FaCircle}
                    selected={pathname[pathname.length - 1] === route.path}
                    onClick={() => {
                      navigate(route.path);
                    }}
                    iconProps={{
                      size: 12,
                      opacity:
                        pathname[pathname.length - 1] === route.path ? 1 : 0.2,
                    }}
                    buttonProps={{
                      alignSelf: 'flex-end',
                      width: 250,
                    }}
                  />
                </motion.div>
              ))}
            </MenuDropdown>
          </div>
        ))}
      </div>
    </div>
  );
}
