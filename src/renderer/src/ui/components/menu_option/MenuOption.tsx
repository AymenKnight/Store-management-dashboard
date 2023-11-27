import color from '@assets/styles/color';
import './style/index.scss';

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
    <div className="menu-option" onClick={onClick}>
      <Icon
        className="icon"
        color={selected ? color.primary : color.secondary}
        fontSize={25}
        {...iconProps}
      />
      <span
        css={{
          color: selected ? color.primary : color.secondary,
          fontWeight: selected ? 'bold' : 'normal',
        }}
      >
        {name}
      </span>
    </div>
  );
}
