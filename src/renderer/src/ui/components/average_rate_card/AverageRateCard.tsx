import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import expenses from 'toPng/expenses.png';
import incoming from 'toPng/incoming.png';
import order from 'toPng/order.png';
import user_profile_test from 'toPng/user_profile_test.png';
import AverageRate from '@components/average_rate/AverageRate';

export interface AverageDetails {
  money: number;
  detail: string;
  percentage: number;
}
interface AverageRateCardProps {
  title: string;
  detail: string;
  incomingAverageDetails: AverageDetails;
  expensesAverageDetails: AverageDetails;
  orderAverageDetails: AverageDetails;
}
export default function AverageRateCard({
  title,
  detail,
  incomingAverageDetails,
  expensesAverageDetails,
  orderAverageDetails,
}: AverageRateCardProps) {
  return (
    <div className="average-rate-card">
      <div className="details-container">
        <div className="title-details-container">
          <span css={{ fontWeight: 'bold', fontSize: 28 }}>{title}</span>
          <span css={{ fontSize: 16 }}>{detail}</span>
        </div>
        <div className="average-container">
          <span css={{ fontSize: 20 }}>Average rate per month</span>
          <div className="averages">
            <AverageRate
              type="income"
              money={incomingAverageDetails.money}
              detail={incomingAverageDetails.detail}
              percentage={incomingAverageDetails.percentage}
            />
            <AverageRate
              type="expenses"
              money={expensesAverageDetails.money}
              detail={expensesAverageDetails.detail}
              percentage={expensesAverageDetails.percentage}
            />
            <AverageRate
              type="archive"
              money={orderAverageDetails.money}
              detail={orderAverageDetails.detail}
              percentage={orderAverageDetails.percentage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
