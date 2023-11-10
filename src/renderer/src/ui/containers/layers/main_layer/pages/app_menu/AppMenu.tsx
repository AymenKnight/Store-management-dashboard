import MenuOption from '@components/menu_option';
import './style/index.scss';
import Logo from 'toSvg/logo.svg';
// import { Cog6ToothIcon as Setting } from '@heroicons/react/24/outline';
import { CubeTransparentIcon as Subjects } from '@heroicons/react/24/outline';
import { HomeIcon as Home } from '@heroicons/react/24/outline';
import { Squares2X2Icon as Courses } from '@heroicons/react/24/outline';
import { UserGroupIcon as Students } from '@heroicons/react/24/outline';
import { AcademicCapIcon as Teachers } from '@heroicons/react/24/outline';
import { CreditCardIcon as Payments } from '@heroicons/react/24/outline';
import { PresentationChartLineIcon as Announcements } from '@heroicons/react/24/outline';
import {
  TicketIcon as Coupons,
  DocumentPlusIcon,
} from '@heroicons/react/24/outline';
import { useRouterState } from '@tanstack/react-router';
import { router } from '@services/routes';

interface AppMenuProps {}
export default function AppMenu({}: AppMenuProps) {
  const {
    location: { pathname },
  } = useRouterState();

  return (
    <div className="app-menu">
      <Logo width={180} height={50} />
      <div className="menu-container">
        <MenuOption
          name="Overview"
          Icon={Home}
          selected={pathname === '/'}
          onClick={() => {
            router.navigate({ to: '/' });
            // console.log('router', router.state);
          }}
        />
        <MenuOption
          name="Subjects"
          Icon={Subjects}
          selected={pathname === '/SUBJECTS'}
          onClick={() => {
            router.navigate({ to: '/SUBJECTS' });
            // console.log('router', router.state);
          }}
        />
        <MenuOption
          name="Create Course"
          Icon={DocumentPlusIcon}
          selected={pathname === '/COURSES/createCourse'}
          onClick={() => {
            router.navigate({ to: '/COURSES/createCourse' });
            // console.log('router', router.state);
          }}
        />
        <MenuOption
          name="Courses"
          Icon={Courses}
          selected={pathname === '/COURSES'}
          onClick={() => {
            router.navigate({ to: '/COURSES' });
          }}
        />
        <MenuOption
          name="Students"
          Icon={Students}
          selected={pathname === '/STUDENTS'}
          onClick={() => {
            router.navigate({ to: '/STUDENTS' });
          }}
        />
        <MenuOption
          name="Teachers"
          Icon={Teachers}
          selected={pathname === '/TEACHERS'}
          onClick={() => {
            router.navigate({ to: '/TEACHERS' });
          }}
        />
        <MenuOption
          name="Payments"
          Icon={Payments}
          selected={pathname === '/PAYMENTS'}
          onClick={() => {
            router.navigate({ to: '/PAYMENTS' });
          }}
        />
        <MenuOption
          name="Announcements"
          Icon={Announcements}
          selected={pathname === '/ANNOUNCEMENTS'}
          onClick={() => {
            router.navigate({ to: '/ANNOUNCEMENTS' });
          }}
        />
        <MenuOption
          name="Coupons"
          Icon={Coupons}
          selected={pathname === '/COUPONS'}
          onClick={() => {
            router.navigate({ to: '/COUPONS' });
          }}
        />
      </div>
    </div>
  );
}
