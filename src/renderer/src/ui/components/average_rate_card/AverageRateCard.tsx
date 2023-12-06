import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import expenses from 'toPng/expenses.png';
import incoming from 'toPng/incoming.png';
import order from 'toPng/order.png';
import user_profile_test from 'toPng/user_profile_test.png';

//TODO add Props
interface AverageRateCardProps {}
export default function AverageRateCard({}: AverageRateCardProps) {
  return (
    <div className="average-rate-card">
      <div className="details-container">
        <div className="title-details-container">
          <span css={{ fontWeight: 'bold', fontSize: 28 }}>card title</span>
          <span css={{ fontSize: 16 }}>
            card detail card detail card detail card detail card detail card
            detail card detail card detail
          </span>
        </div>
        <div className="average-container">
          <span css={{ fontSize: 20 }}>Average rate per month</span>
          <div className="averages">
            <div className="average">
              <img src={incoming} css={{ width: 46, height: 46 }} />
              <div className="average-details">
                <span className="average-money">$15.412</span>
                <span className="average-detail">incoming</span>
                <div className="average-percentage">
                  <BiSolidDownArrow size={18} css={{ color: 'red' }} />
                  <span className="percentage">+5%</span>
                </div>
              </div>
            </div>
            <div className="average">
              <img src={expenses} css={{ width: 46, height: 46 }} />
              <div className="average-details">
                <span className="average-money">$15.412</span>
                <span className="average-detail">expenses</span>
                <div className="average-percentage">
                  <BiSolidDownArrow size={18} css={{ color: 'red' }} />
                  <span className="percentage">+5%</span>
                </div>
              </div>
            </div>
            <div className="average">
              <img src={order} css={{ width: 46, height: 46 }} />
              <div className="average-details">
                <span className="average-money">5.412</span>
                <span className="average-detail">new order</span>
                <div className="average-percentage">
                  <BiSolidUpArrow size={18} css={{ color: 'green' }} />
                  <span className="percentage">+5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
