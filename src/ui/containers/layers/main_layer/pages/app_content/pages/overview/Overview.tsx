import UsersStatsItem from '@components/users_stats_item';
import './style/index.scss';
import StatsItem from '@components/stats_item';
import color from '@assets/styles/color';
import UsersLogo from 'toSvg/users.svg';
import TestSvg from 'toSvg/test_stats.svg';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@services/api/user_api/user.api';
import LoadingSpinner from '@components/loading_spinner';
import { Course } from '@services/dataTypes';
import { fetchCourses } from '@services/api/course_api/course.api';
import { useRef } from 'react';
import { ViewportList } from 'react-viewport-list';
import ErrorAlert from '@components/error_alert';
import { queriesKeys } from '@services/queriesKeys';
import { CustomError } from '@libs/CustomError';

interface OverviewProps {}
export default function Overview({}: OverviewProps) {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery({
    queryKey: [queriesKeys.User],
    queryFn: fetchUsers,
  });

  const {
    data: courses,
    isError: isCourseError,
    isLoading: courseLoading,
    error: courseError,
    isSuccess: isCourseSuccess,
    refetch: courseRefetch,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses],
    queryFn: fetchCourses,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  if (isError || isCourseError) {
    if ((courseError as CustomError).name != 'no_courses_found') {
      return (
        <ErrorAlert
          button={true}
          defaultMessage={true}
          referch={() => {
            refetch();
            courseRefetch();
          }}
        />
      );
    }
  }
  return (
    <div className="overview">
      {isLoading && courseLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : (
        <>
          {isSuccess && (
            <div className="users-stats-container">
              <UsersStatsItem
                statsNumber={users.reduce((acc, user) => {
                  if (user.role === 'ADMIN') {
                    return acc + 1;
                  }
                  return acc;
                }, 0)}
                userType="Admins"
              />
              <UsersStatsItem
                statsNumber={users.reduce((acc, user) => {
                  if (user.role === 'TEACHER') {
                    return acc + 1;
                  }
                  return acc;
                }, 0)}
                userType="Teachers"
              />
              <UsersStatsItem
                statsNumber={users.reduce((acc, user) => {
                  if (user.role === 'LEARNER') {
                    return acc + 1;
                  }
                  return acc;
                }, 0)}
                userType="Students"
              />
            </div>
          )}
          {isCourseSuccess && (
            <div className="scroll-container" ref={ref}>
              <div className="courses-container">
                <ViewportList viewportRef={ref} items={courses}>
                  {(item, index) => (
                    <StatsItem
                      key={index}
                      name={item.title}
                      backgroundColor={color.cold_blue}
                      rating={5}
                      BackgroundSVG={item.image_url}
                      StatsLogo={UsersLogo}
                      statsNumber={item.enrollIndCount}
                      popular={item.popular}
                      topRated={item.topRated}
                    />
                  )}
                </ViewportList>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
