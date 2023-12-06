import MenuOption from '@components/menu_option';
import './style/index.scss';
import { FaCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesData } from '@services/routes';

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
    <div className="menu-dropdown">
      <MenuOption
        name={mainRouteName}
        Icon={mainRouteIcon}
        selected={
          routes
            ? routesData.some((route) => {
                if (route.routes)
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
      {isListShown && routes && routes.length > 0 && (
        <div className="menu-dropdown-list">
          {routes.map((route, index) => (
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
              }}
              buttonProps={{
                alignSelf: 'flex-end',
                width: 250,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
