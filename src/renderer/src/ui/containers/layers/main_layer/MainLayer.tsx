import UserItem from '@components/user_item';
import AppContent from './pages/app_content';
import AppMenu from './pages/app_menu';
import './style/index.scss';
import buy_card from 'toPng/buy_card.png';

import user_image from 'toPng/user_profile_test.png';
import ShowInformationsWithIcon from '@components/show_informations_with_icon';
import ItemComponent from '@components/item_component';
import NotAButton from '@components/not_a_button';

interface MainLayerProps {}
export default function MainLayer({}: MainLayerProps) {
  return (
    <div className="main-layer">
      <AppMenu />
      <UserItem src={user_image} />
      <ShowInformationsWithIcon
        details="details"
        title="title"
        style={{ width: 'fit-content', height: 'fit-content' }}
        titleIcon={buy_card}
        detailsIcon={buy_card}
      />
      <ItemComponent
        title="title"
        category="category"
        price="12"
        style={{ width: '200px', height: '200px' }}
      />
      <NotAButton />
      {/* <AppContent /> */}
    </div>
  );
}
