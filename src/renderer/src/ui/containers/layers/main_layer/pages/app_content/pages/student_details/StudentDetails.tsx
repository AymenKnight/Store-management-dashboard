import MemberItem from '@components/member_item';
import './style/index.scss';
import NotAButton from '@components/not_a_button';
import color from '@assets/styles/color';
import { Course, Student, userCourse } from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import { useParams } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserById } from '@services/api/user_api/user.api';
import {
  addEnrollmentForUser,
  fetchCourses,
  getEnrolledCoursesForUser,
  removeEnrollmentForUser,
} from '@services/api/course_api/course.api';
import LoadingSpinner from '@components/loading_spinner';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import TextButton from '@components/buttons/text_button';
import TextPair from '@components/text_pair/TextPair';
import ErrorAlert from '@components/error_alert';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';

interface StudentDetailsProps {}
export default function StudentDetails({}: StudentDetailsProps) {
  const { userId } = useParams();

  const {
    data: student,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery<Student>({
    queryKey: [queriesKeys.User, userId],
    queryFn: () => fetchUserById(`${userId}`),
  });

  const {
    data: courses,
    isError: isCourseError,
    isLoading: isCoursesLoading,
    isFetching,
    isSuccess: isCoursesSuccess,
    error: courseError,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses],
    queryFn: fetchCourses,
    enabled: !!isSuccess,
  });

  const {
    data: userCourses,
    isError: isUserCourseError,
    isLoading: isUserCourseLoading,
    isFetching: isUserCourseFetching,
    isSuccess: isUserCourseSuccess,
  } = useQuery<userCourse[]>({
    queryKey: [queriesKeys.userCourses, userId],
    queryFn: () => getEnrolledCoursesForUser(`${userId}`),
    enabled: !!isCoursesSuccess,
  });
  const queryClient = useQueryClient();
  const {
    mutate: addEnrollmentForUserMutation,
    isLoading: isAddingEnrollmentLoading,
    isError: isAddingEnrollmentError,
  } = useMutation({
    mutationFn: addEnrollmentForUser,
    onSuccess: () => {
      console.log('data mutate');
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.userCourses, userId],
      });
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const {
    mutate: deleteEnrollmentForUserMutation,
    isLoading: isDeletingEnrollmentLoading,
    isError: isDeletingEnrollmentError,
  } = useMutation({
    mutationFn: removeEnrollmentForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.userCourses, userId],
      });
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<Course & { isEnrolled: boolean }>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Course Name',
        Cell: ({ row, cell }) => (
          <MemberItem
            name={cell.getValue() as string}
            src={`${row.original.image_url}?${new Date()}`}
            id={row.original.id}
          />
        ),
      },
      {
        accessorKey: 'teacher.name',
        header: 'Teacher',
      },
      {
        accessorKey: 'grade.value',
        header: 'Grade',
      },
      {
        accessorKey: 'subject.name',
        header: 'Subject',
      },
      {
        accessorFn: (row) => `${row.popular} ${row.topRated}`,
        header: 'Status',
        Cell: ({ cell, row }) => (
          <>
            {row.original.popular && (
              <NotAButton
                color={color.white}
                backgroundColor={color.hot_purple}
                text="Popular"
                fontSize={12}
                fontWeight={700}
                padding={'5px 8px'}
              />
            )}
            {row.original.topRated && (
              <NotAButton
                color={color.white}
                backgroundColor={color.warm_orange}
                text="Top Rated"
                fontSize={12}
                fontWeight={700}
                padding={'5px 8px'}
              />
            )}
          </>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        Cell: ({ cell }) => cell.getValue<string>().split('T')[0],
      },

      {
        accessorKey: 'isEnrolled',
        header: 'Is Enrolled',
        Cell: ({ cell }) => {
          return cell.getValue<boolean>() ? (
            <NotAButton
              text="Enrolled"
              fontColor={color.white}
              backgroundColor={color.good_green}
            />
          ) : (
            <NotAButton
              fontColor={color.white}
              backgroundColor={color.textGray}
              text="Not Enrolled"
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="student-details">
      {isLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isSuccess ? (
        <>
          <div className="student-row">
            <MemberItem
              name={student?.name}
              src={`${student?.avatar_url}?${new Date()}`}
            />
            <TextPair
              first={{
                text: 'Email',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: student?.email,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Phone',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: student?.phone_number
                  ? student?.phone_number
                  : 'No phone number found',
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Grade',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: student?.grade.value,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Subject',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: student?.subject.name,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
          </div>

          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={
                (isCoursesSuccess && isUserCourseSuccess) ||
                (isCourseError &&
                  (courseError as CustomError).name != 'no_courses_found')
                  ? courses.map((course) => ({
                      ...course,
                      isEnrolled: userCourses
                        .map((userCourse) => userCourse.course_id)
                        .includes(course.id),
                    }))
                  : []
              }
              muiToolbarAlertBannerProps={
                (isCourseError &&
                  (courseError as CustomError).name != 'no_courses_found') ||
                isUserCourseError
                  ? {
                      color: 'error',
                      children: 'Error loading Courses',
                    }
                  : isAddingEnrollmentError
                  ? {
                      color: 'error',
                      children: 'Error activating enrollment',
                    }
                  : isDeletingEnrollmentError
                  ? {
                      color: 'error',
                      children: 'Error deactivating enrollment',
                    }
                  : undefined
              }
              enableColumnOrdering
              enablePagination={true}
              enableSorting={true}
              enableBottomToolbar={true}
              enableTopToolbar={true}
              enableClickToCopy
              enableColumnFilterModes
              enableGrouping
              enablePinning
              enableRowActions
              enableRowSelection
              // initialState={{ showColumnFilters: true }}
              state={{
                isLoading:
                  isCoursesLoading ||
                  isAddingEnrollmentLoading ||
                  isDeletingEnrollmentLoading,
                showAlertBanner: isError,
                showProgressBars: isFetching,
              }}
              positionToolbarAlertBanner="bottom"
              enableGlobalFilter={true}
              positionActionsColumn="last"
              renderRowActions={({ row }) =>
                row.original.isEnrolled ? (
                  <TextButton
                    text="Deactivate"
                    backgroundColor={color.hot_red}
                    fontColor={color.white}
                    onPress={() => {
                      console.log('deactivate');
                      deleteEnrollmentForUserMutation({
                        courseId: row.original.id,
                        learnerId: student.id,
                      });
                    }}
                  />
                ) : (
                  <TextButton
                    text="Activate"
                    backgroundColor={color.primary}
                    fontColor={color.white}
                    onPress={() => {
                      console.log('activate');
                      addEnrollmentForUserMutation({
                        learnerId: student.id,
                        courseId: row.original.id,
                      });
                    }}
                  />
                )
              }
            />
          </ThemeProvider>
        </>
      ) : (
        isError && (
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
    </div>
  );
}
