import UserItem from '@components/user_item';
import AppContent from './pages/app_content';
import AppMenu from './pages/app_menu';
import './style/index.scss';
import TextPair from '@components/text_pair/TextPair';
import user_image from 'toPng/user_profile_test.png';
import ItemComponent from '@components/item_component';

interface MainLayerProps {}
export default function MainLayer({}: MainLayerProps) {
  return (
    <div className="main-layer">
      <ItemComponent />
      <AppMenu />
      <TextPair
        first={{ text: 'text', fontSize: 20 }}
        second={{ text: 'text', fontSize: 20 }}
      />
      <UserItem src={user_image} />
      {/* <AppContent /> */}
    </div>
  );
}
