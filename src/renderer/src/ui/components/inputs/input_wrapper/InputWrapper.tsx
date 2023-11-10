/* eslint-disable no-unused-vars */
import {
  MouseEventHandler,
  ReactNode,
  useState,
  WheelEventHandler,
} from 'react';
import './style/index.scss';

export interface InputWrapperProps {
  background?: string;
  borderColor?: string;
  radius?: number;
  paddingLeft?: number;
  paddingRight?: number;
  fillContainer?: true;
  inputAlignment?: string;
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  errorMessage?: string;
  maxWidth?: number | string;
  onWheel?: WheelEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  noFocus?: true;
  height?: number | string;
  disabled?: boolean;
  touchFirst?: boolean;
}

export default function InputWrapper({
  leading,
  trailing,
  paddingLeft = 0,
  paddingRight = 10,
  inputAlignment = 'flex-start',
  background,
  borderColor,
  radius = 10,
  children,
  errorMessage,
  onClick,
  onWheel,
  maxWidth,
  disabled,
  fillContainer,
  noFocus,
  height = 30,
  touchFirst = false,
}: InputWrapperProps) {
  //FIXME: fix the position of the leading and trailing to the center
  const [isTouched, setIsTouched] = useState(!touchFirst);
  const paddedLeading = leading && (
    <div
      css={{
        paddingLeft: paddingLeft,
      }}
    >
      {leading}
    </div>
  );
  const paddedTrailing = trailing && (
    <div
      css={{
        paddingRight: paddingRight,
      }}
    >
      {trailing}
    </div>
  );
  return (
    <div
      className={`input-wrapper${errorMessage ? ' error' : ''}${
        disabled ? ' disabled' : ''
      }`}
      onClick={(e) => {
        if (!noFocus) e.currentTarget?.querySelector('input')?.focus();
        onClick?.(e);
      }}
      onWheel={onWheel}
      css={{
        backgroundColor: background,
        borderRadius: radius,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        //  flexGrow: fillContainer ? 1 : 0,
        width: !fillContainer ? 'fit-content' : undefined,
        minWidth: maxWidth,
        height: height,
        ...(!isTouched ? { position: 'relative', overflow: 'hidden' } : {}),
      }}
    >
      {
        <>
          {!isTouched && (
            <div
              className="untouched-item"
              onClick={() => {
                setIsTouched(true);
              }}
            >
              Edit
            </div>
          )}

          {paddedLeading}
          <div
            className="input-content"
            css={{
              justifyContent: inputAlignment,
              paddingLeft: leading ? undefined : paddingLeft,
            }}
          >
            {children}
          </div>
          {paddedTrailing}
        </>
      }
    </div>
  );
}
