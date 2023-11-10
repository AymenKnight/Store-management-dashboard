import { MouseEventHandler, useEffect, useState } from 'react';
import './style/index.scss';
import SVG from 'react-inlinesvg';
import { createAvatar } from '@dicebear/core';
import * as style from '@dicebear/avatars-initials-sprites';

interface CircleAvatarProps {
  src?: string;
  width: number;
  alt: string;
  radius?: number | string;
  border?: string;
  // onClick?: MouseEventHandler<HTMLDivElement>;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  direct?: boolean;
  open?: boolean;
  className?: string;
}
function CircleAvatar({
  src,
  width,
  alt,
  radius = '100%',
  border,
  onClick,
  direct,
  open,
  className,
}: CircleAvatarProps) {
  const avatar = createAvatar(style as any, {
    seed: alt,
  });

  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (isError) setIsError(false);
    else return;
  }, [src]);
  return (
    <div
      className={`circle-avatar ${onClick ? 'clickable' : ''} ${
        className && className
      }`}
      css={{
        borderRadius: radius,
        border: border,
      }}
      onClick={onClick}
      // role="button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
    >
      {src && !isError ? (
        <img
          css={{
            width: width,
            height: width,
          }}
          src={src}
          onError={() => {
            setIsError(true);
          }}
          alt={alt}
        />
      ) : (
        <SVG src={avatar.toString()} width={width} />
      )}
    </div>
  );
}

export default CircleAvatar;
