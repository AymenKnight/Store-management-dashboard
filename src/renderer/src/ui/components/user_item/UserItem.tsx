import './style/index.scss';
import user_image from 'toPng/user_profile_test.png';

interface UserItemProps {}
export default function UserItem({}: UserItemProps) {
  return (
    <div className="user-item">
      <img src={user_image} alt="user" width={100} height={100} />
      <div className="user-info-container">
        <span>Ghanou faycel</span>
        <span>Owner</span>
      </div>
    </div>
  );
}
