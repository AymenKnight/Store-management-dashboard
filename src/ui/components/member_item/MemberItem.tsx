import CircleAvatar from '@components/circle_avatar';
import './style/index.scss';

interface MemberItemProps {
  src?: string;
  name: string;
  id?: string;
  open?: boolean;
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void;
  width?: number;
  maxTextWidth?: number | string;
}
export default function MemberItem({
  src,
  name,
  id,
  handleClick,
  open,
  width = 35,
  maxTextWidth = 150,
}: MemberItemProps) {
  return (
    <div className="member-item">
      <CircleAvatar
        onClick={handleClick}
        src={src}
        width={width}
        alt={name}
        open={open}
      />
      <div className="id-container">
        <span
          css={{
            width: maxTextWidth,
          }}
        >
          {name}
        </span>
        {id && (
          <span
            css={{
              width: maxTextWidth,
            }}
          >
            #{id}
          </span>
        )}
      </div>
    </div>
  );
}
