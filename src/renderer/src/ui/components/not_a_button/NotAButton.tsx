import { ComponentProps } from 'react';
import TextButton from '@components/buttons/text_button';

function NotAButton({
  ...props
}: Omit<
  ComponentProps<typeof TextButton>,
  'onPress' | 'onHold' | 'blank' | 'cursor'
> & { color?: string }) {
  return (
    <TextButton
      {...props}
      cursor={'default'}
      activeBgColor={'transparent' ?? props.activeBgColor}
      width={props.width ?? 'fit-content'}
      blank
      fake
    />
  );
}

export default NotAButton;
