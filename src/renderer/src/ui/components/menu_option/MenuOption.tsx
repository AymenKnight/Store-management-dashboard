import color from '@assets/styles/color';
import './style/index.scss';
import TextButton from '@components/buttons/text_button';
import { TextButtonProps } from '@components/buttons/text_button/TextButton';
import { IconBaseProps, IconType } from 'react-icons';

interface MenuOptionProps {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | IconType;
  iconProps?:
    | (React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>)
    | IconBaseProps;
  onClick?: () => void;
  selected?: boolean;
  buttonProps?: TextButtonProps;
}
export default function MenuOption({
  name,
  Icon,
  iconProps,
  onClick,
  selected = false,
  buttonProps,
}: MenuOptionProps) {
  return (
    <TextButton
      text={name}
      fontSize={15}
      fontColor={color.primary}
      onPress={onClick}
      backgroundColor={selected ? color.background : 'transparent'}
      borderColor={selected ? color.border_color : 'transparent'}
      afterBgColor={color.background}
      activeBorderColor={color.border_color}
      afterBorderColor={color.border_color}
      css={{
        gap: 15,
        transition: 'all 0.3s ease-in-out',
        '> .text': {
          textAlign: 'left',
        },
      }}
      alignment="flex-start"
      Icon={<Icon fontSize={25} color={color.primary} {...iconProps} />}
      width={280}
      padding={'10px 15px'}
      {...buttonProps}
    />
  );
}
