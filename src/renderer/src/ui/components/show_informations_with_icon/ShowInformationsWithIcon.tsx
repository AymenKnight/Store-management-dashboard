import './style/index.scss';
import React from 'react';
//import buyCard from '@assets/svg/buy_card.svg';
//import buyCard from 'toSvg/buy_card.svg';

interface ShowInformationsWithIconProps {
  title: string;
  titleIcon: string;
  details: string;
  detailsIcon: string;
  iconText?: string;
  style?: React.CSSProperties;
}
export default function ShowInformationsWithIcon({
  title,
  titleIcon,
  details,
  detailsIcon,
  iconText = undefined,
  style,
}: ShowInformationsWithIconProps) {
  console.log('iconText', typeof iconText);
  return (
    <div className="show-informations-with-icon" style={style}>
      <div className="information-container">
        <div className="title">
          <img src={titleIcon} className="titleIcon" />
          <h2>{title}</h2>
        </div>
        <div className="details">
          <img src={detailsIcon} />
          <h1>{details}</h1>
        </div>
      </div>
      <div className="icon-container">
        <img src={detailsIcon} />
        <p>
          <b>{details}</b>
        </p>
      </div>
    </div>
  );
}
