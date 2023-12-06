import color from '@assets/styles/color';
import './style/index.scss';
import TextButton from '@components/buttons/text_button';

interface MenuOptionProps {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconProps?: React.SVGProps<SVGSVGElement> &
    React.RefAttributes<SVGSVGElement>;
  onClick?: () => void;
  selected?: boolean;
}
export default function MenuOption({
  name,
  Icon,
  iconProps,
  onClick,
  selected = false,
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
      }}
      alignment="flex-start"
      Icon={<Icon fontSize={20} color={color.primary} {...iconProps} />}
      width={200}
      padding={'8px 15px'}
    />
  );
}
