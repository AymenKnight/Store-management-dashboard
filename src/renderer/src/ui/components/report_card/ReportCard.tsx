import './style/index.scss';
import { RiArrowDownSFill } from 'react-icons/ri';
import { BiSolidUpArrow } from 'react-icons/bi';

interface ReportCardProps {
  title: string;
  value: number;
  percentage?: number;
}
export default function ReportCard({
  title,
  value,
  percentage,
}: ReportCardProps) {
  return (
    <div className="report-card">
      <span>{title}</span>
      <span>${value}DZ</span>
      {percentage != undefined && (
        <div className="percentage-div">
          {percentage > 0 ? (
            <BiSolidUpArrow size={18} css={{ color: 'green' }} />
          ) : (
            <RiArrowDownSFill size={18} css={{ color: 'red' }} />
          )}
          <span css={{ color: percentage > 0 ? 'green' : 'red' }}>
            {percentage}
          </span>
        </div>
      )}
    </div>
  );
}
