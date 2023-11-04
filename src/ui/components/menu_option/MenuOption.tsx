import color from '@assets/styles/color';
import './style/index.scss';

interface MenuOptionProps {
  name: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
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
        width={30}
        height={30}
        stroke={selected ? color.primary : color.secondary}
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
