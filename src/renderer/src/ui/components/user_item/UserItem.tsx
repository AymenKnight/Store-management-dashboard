import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ClassNames } from '@emotion/react';

interface UserItemProps {
  width?: number;
  height?: number;
  src: string;
}
export default function UserItem({
  width = 100,
  height = 100,
  src,
}: UserItemProps) {
  return (
    <div className="user-item">
      <TextButton
        Icon={<BsThreeDotsVertical height={60} width={60} />}
        className="menu-button"
        height={40}
        width={40}
      />
      <img src={src} alt="user" width={width} height={height} />
      <div className="user-info-container">
        <span>Ghanou faycel</span>
        <span>Owner</span>
      </div>
    </div>
  );
}
