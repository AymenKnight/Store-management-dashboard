import color from '@assets/styles/color';
import TextButton from '../text_button';
import './style/index.scss';
import { PlusIcon } from '@heroicons/react/24/solid';

interface BlueAddButtonProps {
  text: string;
  onPress?: () => void;
}
export default function BlueAddButton({ onPress, text }: BlueAddButtonProps) {
  return (
    <TextButton
      text={text}
      backgroundColor={color.primary}
      padding={'5px 10px'}
      fontSize={15}
      fontWeight={500}
      fontColor={color.white}
      Icon={
        <PlusIcon width={25} height={25} stroke={color.white} strokeWidth={2} />
      }
      onPress={onPress}
    />
  );
}
