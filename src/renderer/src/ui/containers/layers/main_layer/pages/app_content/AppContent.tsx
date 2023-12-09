import './style/index.scss';
import Header from '@components/header';
import color from '@assets/styles/color';
import HeaderControls from '@components/header_controls';
import { Outlet } from 'react-router-dom';
import PageTitleRefresh from '@components/page_title_refresh';
interface AppContentProps {}
export default function AppContent({}: AppContentProps) {
  return (
    <div className="app-content">
      <Header
        title={{
          text: 'Welcome to Walid Academy Dashboard',
          fontColor: color.secondary,
          fontSize: 24,
          fontWeight: 500,
        }}
        padding={0}
        alignItems="center"
        buttonNode={<HeaderControls />}
      />
      <PageTitleRefresh title="static page" />

      <Outlet />
    </div>
  );
}
