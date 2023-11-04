import color from '@assets/styles/color';
import './style/index.scss';
import { PlusIcon } from '@heroicons/react/24/solid';

interface AddItemBoxProps {
  onClick?: () => void;
  name: string;
}
export default function AddItemBox({ name, onClick }: AddItemBoxProps) {
  return (
    <div className="add-item-box" onClick={onClick}>
      <div className="add-item-box-content">
        <PlusIcon width={60} fill={color.cold_blue} />
        <span>{name}</span>
      </div>
    </div>
  );
}
