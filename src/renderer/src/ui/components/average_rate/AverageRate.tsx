import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import { IoDiamondSharp } from 'react-icons/io5';
import { GiExpense } from 'react-icons/gi';
import { FaArchive } from 'react-icons/fa';
import NotAButton from '@components/not_a_button';
import color from '@assets/styles/color';
interface AverageRateProps {
  type: 'income' | 'expenses' | 'archive';
  value: number;
  detail: string;
  percentage: number;
}
export default function AverageRate({
  type,
  value,
  detail,
  percentage,
}: AverageRateProps) {
  return (
    <div className="average">
      {type === 'income' ? (
        <div className="icon" css={{ backgroundColor: color.good_green }}>
          <IoDiamondSharp size={30} color="black" />
        </div>
      ) : type === 'expenses' ? (
        <div className="icon" css={{ backgroundColor: color.hot_red }}>
          <GiExpense size={30} color="black" />
        </div>
      ) : (
        <div className="icon" css={{ backgroundColor: color.cold_blue }}>
          <FaArchive size={30} color="black" />
        </div>
      )}

      <div className="average-details">
        <div className="average-details-header">
          <div className="value-container">
            <span>{value}</span>
            <span>DZ</span>
          </div>
          <span className="detail-span">{detail}</span>
        </div>
        <NotAButton
          Icon={
            percentage > 0 ? (
              <BiSolidUpArrow size={18} css={{ color: color.good_green }} />
            ) : (
              <BiSolidDownArrow size={18} css={{ color: color.hot_red }} />
            )
          }
          text={`${percentage > 0 ? '+' : ''}${percentage}%`}
          fontColor={percentage > 0 ? color.good_green : color.hot_red}
          padding={0}
        />
      </div>
    </div>
  );
}
