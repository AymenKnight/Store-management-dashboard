import color from '@assets/styles/color';
import IconicButton from '../iconic_button';
import './style/index.scss';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface EyePasswordProps {
  onPress: () => void;
  value: boolean;
}
export default function EyePassword({ onPress, value }: EyePasswordProps) {
  return (
    <IconicButton
      Icon={
        value ? (
          <EyeSlashIcon
            width={20}
            height={20}
            stroke={color.secondary}
            fill={color.secondary}
          />
        ) : (
          <EyeIcon width={20} height={20} fill={color.secondary} />
        )
      }
      onPress={onPress}
      blank
      type="button"
      unFocusable
    />
  );
}
