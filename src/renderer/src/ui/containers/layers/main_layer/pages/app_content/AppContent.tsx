import './style/index.scss';
import Header from '@components/header';
import color from '@assets/styles/color';
import HeaderControls from '@components/header_controls';
import { Outlet } from 'react-router-dom';
import PageTitleRefresh from '@components/page_title_refresh';
import AverageRate from '@components/average_rate';
import AverageRateCard from '@components/average_rate_card';
import ReportCard from '@components/report_card';
interface AppContentProps {}
const AverageDetails = {
  money: 0,
  detail: '',
  percentage: 0,
};
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

      <AverageRateCard
        title="tile"
        detail="detail"
        incomingAverageDetails={{
          money: 0,
          detail: '',
          percentage: 0,
        }}
        expensesAverageDetails={{
          money: 0,
          detail: '',
          percentage: 0,
        }}
        orderAverageDetails={{
          money: 0,
          detail: '',
          percentage: 0,
        }}
      />

      <ReportCard title="title" value={0} percentage={0} type="profit" />

      <Outlet />
    </div>
  );
}
