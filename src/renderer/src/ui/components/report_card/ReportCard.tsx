import NotAButton from '@components/not_a_button';
import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import { GrMoney } from 'react-icons/gr';
import { GiProfit } from 'react-icons/gi';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';

interface ReportCardProps {
  type: 'revenue' | 'expense' | 'profit';
  title: string;
  value: number;
  percentage?: number;
}
export default function ReportCard({
  type,
  title,
  value,
  percentage,
}: ReportCardProps) {
  return (
    <div className="report-card-container">
      {type === 'revenue' ? (
        <GrMoney size={20} color="white" />
      ) : type === 'expense' ? (
        <BsFillCreditCard2FrontFill size={20} color="red" />
      ) : (
        <GiProfit size={20} color="green" />
      )}
      <div className="report-card">
        <span>{title}</span>
        <span>${value}DZ</span>
        {percentage != undefined && (
          <div className="percentage-div">
            {percentage > 0 ? (
              <BiSolidUpArrow size={18} css={{ color: 'green' }} />
            ) : (
              <BiSolidDownArrow size={18} css={{ color: 'red' }} />
            )}
            <span css={{ color: percentage > 0 ? 'green' : 'red' }}>
              {percentage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
