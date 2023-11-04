import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import color from '@assets/styles/color';
interface ErrorAlertProps {
  message?: string;
  defaultMessage: boolean;
  button?: boolean;
  width?: string;
  height?: string;
  referch?: () => void;
}
export default function ErrorAlert({
  message,
  button,
  width,
  height,
  defaultMessage,
  referch,
}: ErrorAlertProps) {
  return (
    <div className="error-alert" css={{ width: width, height: height }}>
      <div className="alert-icon">
        <ExclamationCircleIcon />
      </div>
      <h3>Error!</h3>
      {defaultMessage ? (
        <span>
          We apologize, but it seems that the requested data is not available at
          the moment. Please try again by clicking the button below.
        </span>
      ) : (
        <span>{message}</span>
      )}
      {button && (
        <TextButton
          text="Refetch"
          backgroundColor={color.good_green}
          fontColor={color.white}
          padding={'8px 15px'}
          onPress={referch}
        />
      )}
    </div>
  );
}
