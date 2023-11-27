import AppContent from './pages/app_content';
import AppMenu from './pages/app_menu';
import './style/index.scss';

interface MainLayerProps {}
export default function MainLayer({}: MainLayerProps) {
  return (
    <div className="main-layer">
      <AppMenu />

      {/* <AppContent /> */}
    </div>
  );
}
