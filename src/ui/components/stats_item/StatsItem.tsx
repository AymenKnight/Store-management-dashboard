import Header from '@components/header';
import NotAButton from '@components/not_a_button';
import Star from 'toSvg/star.svg';
import color from '@assets/styles/color';
import './style/index.scss';
import SVG from 'react-inlinesvg';
import { createAvatar } from '@dicebear/core';
import * as style from '@dicebear/avatars-initials-sprites';

interface StatsItemProps {
  rating?: number;
  name: string;
  topRated?: boolean;
  popular?: boolean;
  statsNumber?: number;
  StatsLogo?: React.FC<React.SVGProps<SVGElement>>;
  backgroundColor?: string;
  BackgroundSVG?: string;
  className?: string;
  children?: React.ReactNode;
}
export default function StatsItem({
  rating,
  name,
  topRated,
  popular,
  statsNumber,
  StatsLogo,
  backgroundColor = color.cold_blue,
  BackgroundSVG,
  className,
  children,
}: StatsItemProps) {
  const avatar = createAvatar(style as any, {
    seed: name,
  });
  return (
    <div className={`stats-item ${className}`} css={{ backgroundColor }}>
      <div className="background-image-wrapper">
        <Header
          leftComponent={
            rating ? (
              <NotAButton
                text={rating.toString()}
                fontColor={color.good_black}
                fontSize={12}
                fontWeight={700}
                padding={'5px 8px'}
                css={{ gap: 5, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5);' }}
                backgroundColor={color.white}
                radius="10px 0px"
                Icon={<Star width={15} height={15} />}
              />
            ) : undefined
          }
          buttonNode={
            <div className="tags-container">
              {topRated && (
                <NotAButton
                  text={'Top Rated'}
                  fontColor={color.white}
                  fontSize={12}
                  fontWeight={700}
                  padding={'5px 8px'}
                  css={{
                    gap: 5,
                    textAlign: 'right',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5);',
                  }}
                  backgroundColor={color.warm_orange}
                  radius="10px 0px"
                />
              )}
              {popular && (
                <NotAButton
                  text={'Popular'}
                  fontColor={color.white}
                  fontSize={12}
                  fontWeight={700}
                  padding={'5px 8px'}
                  css={{
                    gap: 5,
                    textAlign: 'right',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5);',
                  }}
                  backgroundColor={color.hot_purple}
                  radius="10px 0px"
                />
              )}
            </div>
          }
        />
        <img className="background-image" src={BackgroundSVG} alt={name} />
      </div>
      <Header
        title={{
          text: name,
          fontColor: color.white,
          fontSize: 20,
          fontWeight: 700,
        }}
        buttonNode={
          <div className="user-stats-container">
            {statsNumber != undefined && <span>{statsNumber}</span>}
            {StatsLogo && (
              <StatsLogo width={70} height={30} fill={color.white} />
            )}
          </div>
        }
        padding="0 10px 10px 10px"
        alignItems="baseline"
      />
      {children}
    </div>
  );
}
