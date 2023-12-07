import MenuOption from '@components/menu_option';
import './style/index.scss';
import { FaCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesData } from '@services/routes';
import { AnimatePresence, motion } from 'framer-motion';

interface MenuDropdownProps {
  mainRouteName: string;
  mainRouteIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  routes?: {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
    onClick?: () => void;
  }[];
  selected?: boolean;
}
export default function MenuDropdown({
  selected = false,
  mainRouteName,
  mainRouteIcon,
  routes,
}: MenuDropdownProps) {
  const [isListShown, setIsListShown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname.split('/');

  console.log('pathname', pathname[pathname.length - 1]);
  return (
    <motion.div
      className="menu-dropdown"
      initial={{ gap: 0 }}
      animate={{ gap: 10 }}
      exit={{ gap: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <MenuOption
        name={mainRouteName}
        Icon={mainRouteIcon}
        selected={
          routes
            ? routesData.some((route) => {
                if (route.routes && route.mainRouteName == mainRouteName)
                  return route.routes.some((route) => {
                    return route.path === pathname[pathname.length - 1];
                  });
              })
            : false
        }
        onClick={() => {
          setIsListShown(!isListShown);
        }}
      />
      <AnimatePresence mode="wait">
        {isListShown && routes && routes.length > 0 && (
          <motion.div
            className="menu-dropdown-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {routes.map((route, index) => (
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
