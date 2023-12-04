import './style/index.scss';
import increase from 'toPng/increase.png';
import decrease from 'toPng/decrease.png';
interface ReportCardProps {
  style?: React.CSSProperties;
  title: string;
  valeu: string;
  persentage: string;
}
export default function ReportCard({
  style,
  title,
  valeu,
  persentage,
}: ReportCardProps) {
  return (
    <div className="report-card" style={style}>
      <div>{title}</div>
      <div>{valeu}</div>
      {Array.from(persentage)[0] == '-' ? (
        <div className="persentage">
          <img src={decrease} style={{ width: '50px', height: '50px' }} />
          <div style={{ color: 'red' }}>{persentage}</div>
        </div>
      ) : (
        <div className="persentage">
          <img src={increase} style={{ width: '50px', height: '50px' }} />
          <div style={{ color: 'green' }}>{persentage}</div>
        </div>
      )}
    </div>
  );
}
