import Header from '@components/header';
import './style/index.scss';
import color from '@assets/styles/color';
import UsersLogo from 'toSvg/users.svg';

interface UsersStatsItemProps {
  statsNumber: number;
  statsNumberColor?: string;
  userType: string;
  userLogoColor?: string;
}
export default function UsersStatsItem({
  statsNumber,
  statsNumberColor = color.primary,
  userType,
  userLogoColor = color.primary,
}: UsersStatsItemProps) {
  return (
    <div className="users-stats-item">
      <Header
        title={{
          text: statsNumber.toString(),
          fontSize: 24,
          fontWeight: 600,
          fontColor: statsNumberColor,
        }}
        padding={0}
      />
      <Header
        title={{
          text: userType,
          fontSize: 17,
          fontWeight: 600,
          fontColor: color.good_black,
        }}
        buttonNode={
          <UsersLogo fill={userLogoColor} style={{ width: 90, height: 60 }} />
        }
        padding={0}
      />
    </div>
  );
}
