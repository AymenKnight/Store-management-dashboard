import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import expenses from 'toPng/expenses.png';
import { IoDiamondSharp } from 'react-icons/io5';
import { GiExpense } from 'react-icons/gi';
import { FaArchive } from 'react-icons/fa';
interface AverageRateProps {
  type: 'income' | 'expenses' | 'archive';

  money: number;
  detail: string;
  percentage: number;
}
export default function AverageRate({
  type,
  money,
  detail,
  percentage,
}: AverageRateProps) {
  return (
    <div className="average">
      {type === 'income' ? (
        <div className="icon" css={{ backgroundColor: 'green' }}>
          <IoDiamondSharp size={30} color="black" />
        </div>
      ) : type === 'expenses' ? (
        <div className="icon" css={{ backgroundColor: 'red' }}>
          <GiExpense size={30} color="black" />
        </div>
      ) : (
        <div className="icon" css={{ backgroundColor: 'blue' }}>
          <FaArchive size={30} color="black" />
        </div>
      )}

      <div className="average-details">
        <span className="average-money">{money} DZ</span>
        <span className="average-detail">{detail}</span>
        <div className="average-percentage">
          {percentage > 0 ? (
            <BiSolidUpArrow size={18} css={{ color: 'green' }} />
          ) : (
            <BiSolidDownArrow size={18} css={{ color: 'red' }} />
          )}
          {percentage > 0 ? (
            <span className="percentage" css={{ color: 'green' }}>
              +{percentage}%
            </span>
          ) : (
            <span className="percentage" css={{ color: 'red' }}>
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
