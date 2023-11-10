import MainLayer from '@containers/layers/main_layer';
import AppContent from '@containers/layers/main_layer/pages/app_content';
import Announcement from '@containers/layers/main_layer/pages/app_content/pages/announcement';
import Branches from '@containers/layers/main_layer/pages/app_content/pages/branches';
import Coupon from '@containers/layers/main_layer/pages/app_content/pages/coupon';
import CourseDetails from '@containers/layers/main_layer/pages/app_content/pages/course_details';
import Courses from '@containers/layers/main_layer/pages/app_content/pages/courses';
import CreateCourse from '@containers/layers/main_layer/pages/app_content/pages/create_course';
import Overview from '@containers/layers/main_layer/pages/app_content/pages/overview';
import Payments from '@containers/layers/main_layer/pages/app_content/pages/payments';
import StudentDetails from '@containers/layers/main_layer/pages/app_content/pages/student_details';
import Students from '@containers/layers/main_layer/pages/app_content/pages/students';
import TeacherDetails from '@containers/layers/main_layer/pages/app_content/pages/teacher_details';
import Teachers from '@containers/layers/main_layer/pages/app_content/pages/teachers';
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router';
// import { fetchCoursesById } from './api/course_api/course.api';

export const rootRoute = new RootRoute({
  component: MainLayer,
});

export const overviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Overview,
});

export const subjectsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/SUBJECTS',
  component: Branches,
});

export const createCourseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/COURSES/createCourse',
  component: CreateCourse,
});

export const coursesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/COURSES',
  component: Courses,
});

export const courseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/COURSES/$courseId',
  component: CourseDetails,
  // loader: async ({ params: { courseId } }) => {
  //   const course = await fetchCoursesById(courseId)
  //     .then((data) => {
  //       console.log('data course', data);
  //       return data;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // },
});

export const paymentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/PAYMENTS',
  component: Payments,
});

export const studentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/STUDENTS',
  component: Students,
});

export const studentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/STUDENTS/$userId',
  component: StudentDetails,
});

export const teachersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/TEACHERS',
  component: Teachers,
});

export const teacherRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/TEACHERS/$userId',
  component: TeacherDetails,
});

export const announcementRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/ANNOUNCEMENTS',
  component: Announcement,
});

export const couponsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/COUPONS',
  component: Coupon,
});

export const routeTree = rootRoute.addChildren([
  overviewRoute,
  subjectsRoute,
  createCourseRoute,
  coursesRoute.addChildren([courseRoute]),
  paymentsRoute,
  studentsRoute.addChildren([studentRoute]),
  teachersRoute.addChildren([teacherRoute]),
  announcementRoute,
  couponsRoute,
]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
