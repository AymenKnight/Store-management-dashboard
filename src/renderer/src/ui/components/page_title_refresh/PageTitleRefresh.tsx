import './style/index.scss';
import { LuRefreshCw } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';
interface PageTitleRefreshProps {
  title: string;
}

export default function PageTitleRefresh({ title }: PageTitleRefreshProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="page-title-refresh">
      <div className="title_container">
        <span>{title}</span>
      </div>
      <div className="date_container">
        <span>{time.toLocaleString()}</span>
      </div>
    </div>
  );
}
