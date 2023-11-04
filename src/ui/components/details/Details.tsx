import { ReactNode } from 'react';
import './style/index.scss';
interface DetailsProps {
  title: string;
  children: ReactNode;
}
export default function Details({ title, children }: DetailsProps) {
  return (
    <div className="details">
      <div className="header">
        <h3> {title} </h3>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
