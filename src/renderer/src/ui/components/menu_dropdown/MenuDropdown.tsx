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
  setIsListShown?: () => void;
  mainRouteSelected?: boolean;
  children?: React.ReactNode[];
}
export default function MenuDropdown({
  selected = false,
  mainRouteName,
  mainRouteIcon,
  routes,
  setIsListShown,
  mainRouteSelected = false,
  children,
}: MenuDropdownProps) {
  const [isListShown, setIsListShownState] = useState<boolean>(selected);

  const handleSelection = () => {
    if (selected) {
      setIsListShownState(!isListShown);
    } else {
      setIsListShownState(true);
      setIsListShown && setIsListShown();
    }
  };

  return (
    <div>
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
          selected={mainRouteSelected}
          onClick={handleSelection}
        />
        <AnimatePresence mode="wait">
          {isListShown && selected && routes && routes.length > 0 && (
            <motion.div
              className="menu-dropdown-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
