import NotAButton from '@components/not_a_button';
import './style/index.scss';
import { BiSolidDownArrow } from 'react-icons/bi';
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
  //TODO add icon for title
  return (
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
  );
}
