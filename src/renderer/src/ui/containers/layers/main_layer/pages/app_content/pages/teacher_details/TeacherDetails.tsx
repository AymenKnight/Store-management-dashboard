import './style/index.scss';
import NotAButton from '@components/not_a_button';
import { useQuery } from '@tanstack/react-query';
import { Course, Teacher } from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import { fetchUserById } from '@services/api/user_api/user.api';
import { useParams } from '@tanstack/react-router';
import LoadingSpinner from '@components/loading_spinner';
import { fetchCoursesByTeacher } from '@services/api/course_api/course.api';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import color from '@assets/styles/color';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import MemberItem from '@components/member_item';
import TextPair from '@components/text_pair/TextPair';
import ErrorAlert from '@components/error_alert';

interface TeacherDetailsProps {}
export default function TeacherDetails({}: TeacherDetailsProps) {
  const { userId } = useParams();

  const {
    data: teacher,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery<Teacher>({
    queryKey: [queriesKeys.Users, userId],
    queryFn: () => fetchUserById(`${userId}`),
  });

  const {
    data: courses,
    isError: courseError,
    isLoading: courseLoading,
    isFetching,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses, userId],
    queryFn: () => fetchCoursesByTeacher(`${userId}`),
  });

  const columns = useMemo<MRT_ColumnDef<Course>[]>(
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
        accessorKey: 'grade.value',
        header: 'Grade',
      },

      {
        accessorKey: 'teacher.name',
        header: 'Teacher',
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
        accessorKey: 'enrollIndCount',
        header: 'Students',
      },
    ],
    [],
  );

  return (
    <div className="teacher-details">
      {isLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isSuccess ? (
        <>
          <div className="teacher-row">
            <MemberItem
              name={teacher?.name}
              src={`${teacher?.avatar_url}?${new Date()}`}
            />
            <TextPair
              first={{
                text: 'Email',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: teacher?.email,
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
                text: teacher?.phone_number
                  ? teacher?.phone_number
                  : 'No phone number found',
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
              data={courses ?? []}
              muiToolbarAlertBannerProps={
                courseError
                  ? {
                      color: 'error',
                      children: 'Error loading data',
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
              enableRowSelection
              // initialState={{ showColumnFilters: true }}
              state={{
                isLoading,
                showAlertBanner: isError,
                showProgressBars: isFetching,
              }}
              positionToolbarAlertBanner="bottom"
              enableGlobalFilter={true}
              positionActionsColumn="last"
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
