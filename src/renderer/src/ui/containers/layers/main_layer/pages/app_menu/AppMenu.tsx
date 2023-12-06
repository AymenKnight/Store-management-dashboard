import MenuOption from '@components/menu_option';
import './style/index.scss';
import Logo from 'toSvg/logo.svg';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import MenuDropdown from '@components/menu_dropdown';
import { routesData } from '@services/routes';


interface AppMenuProps {}
export default function AppMenu({}: AppMenuProps) {
  return (
    <div className="app-menu">
      <Logo width={180} height={50} />
      <div className="menu-container">
        {routesData.map((route, index) => (
          <MenuDropdown
            key={index}
            mainRouteName={route.mainRouteName}
            mainRouteIcon={route.mainRouteIcon}
            routes={route.routes}
          />
        ))}

        <MenuOption
          name="Products"
          Icon={RiShoppingBag3Fill}
          onClick={() => {
            console.log('products');
          }}
        />
      </div>
    </div>
  );
}
