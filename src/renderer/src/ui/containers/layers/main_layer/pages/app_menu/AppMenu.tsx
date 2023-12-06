import MenuOption from '@components/menu_option';
import './style/index.scss';
import Logo from 'toSvg/logo.svg';
import { BiSolidDashboard } from 'react-icons/bi';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { MdGroups } from 'react-icons/md';
import { FaCreditCard } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import TextButton from '@components/buttons/text_button';
import color from '@assets/styles/color';

interface AppMenuProps {}
export default function AppMenu({}: AppMenuProps) {
  return (
    <div className="app-menu">
      <Logo width={180} height={50} />
      <div className="menu-container">
        <MenuOption
          name="Overview"
          Icon={BiSolidDashboard}
          selected={true}
          onClick={() => {
            console.log('overview');
          }}
        />
        <MenuOption
          name="Products"
          Icon={RiShoppingBag3Fill}
          onClick={() => {
            console.log('products');
          }}
        />
        <MenuOption
          name="Orders"
          Icon={IoDocumentTextSharp}
          onClick={() => {
            console.log('orders');
          }}
        />
        <MenuOption
          name="Customers"
          Icon={MdGroups}
          iconProps={{
            fontSize: 25,
          }}
          onClick={() => {
            console.log('customers');
          }}
        />
        <MenuOption
          name="Payments"
          Icon={FaCreditCard}
          onClick={() => {
            console.log('payments');
          }}
        />
        <MenuOption
          name="Settings"
          Icon={IoMdSettings}
          onClick={() => {
            console.log('settings');
          }}
        />
      </div>
    </div>
  );
}
