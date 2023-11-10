import './style/index.scss';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import color from '@assets/styles/color';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import BlueAddButton from '@components/buttons/blue_add_button';
import MemberItem from '@components/member_item';
import { DeleteOutline } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ListItemIcon, MenuItem } from '@mui/material';
import { Course } from '@services/dataTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotAButton from '@components/not_a_button';
import {
  deleteCourse,
  fetchCourses,
} from '@services/api/course_api/course.api';
import { router } from '@services/routes';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';

interface CoursesProps {}
export default function Courses({}: CoursesProps) {
  const queryClient = useQueryClient();
  const {
    data: courses,
    isError: isCourseError,
    isFetching,
    isLoading,
    isSuccess,
    error: courseError,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses],
    queryFn: fetchCourses,

    retry: (_, err) => {
      if ((err as CustomError).name == 'no_courses_found') {
        return false;
      }

      return true;
    },
  });

  const {
    isLoading: isDeleteCourseLoading,
    isError: isDeleteCourseError,
    mutate: deleteCourseMutation,
    error: deleteCourseError,
  } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Courses] });
      toast.success('Course has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
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
        Cell: ({ row }) => (
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
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },

      {
        accessorKey: 'enrollIndCount',
        header: 'Students',
      },
    ],
    [],
  );

  return (
    <div className="courses">
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={
            isCourseError &&
            (courseError as CustomError).name == 'no_courses_found'
              ? []
              : courses ?? []
          }
          muiToolbarAlertBannerProps={
            isCourseError &&
            (courseError as CustomError).name != 'no_courses_found'
              ? {
                  color: 'error',
                  children: 'Error loading data',
                }
              : isDeleteCourseError
              ? {
                  color: 'error',
                  children: deleteCourseError.message,
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
          enableFilters
          // initialState={{ showColumnFilters: true }}
          state={{
            isLoading: isDeleteCourseLoading || isLoading,
            showAlertBanner: isCourseError,
            showProgressBars: isFetching,
          }}
          positionToolbarAlertBanner="bottom"
          enableGlobalFilter={true}
          positionActionsColumn="last"
          renderTopToolbarCustomActions={({ table }) => {
            return (
              <BlueAddButton
                text="New Course"
                onPress={() => {
                  router.navigate({
                    to: '/COURSES/createCourse',
                  });
                }}
              />
            );
          }}
          renderRowActionMenuItems={({ closeMenu, row }) => [
            <MenuItem
              key={1}
              onClick={() => {
                router.navigate({
                  to: '/COURSES/$courseId',
                  params: { courseId: row.original.id },
                });
                closeMenu();
              }}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <VisibilityOutlinedIcon />
              </ListItemIcon>
              View Details
            </MenuItem>,
            <MenuItem
              key={2}
              onClick={() => {
                deleteCourseMutation(row.original.id);

                closeMenu();
              }}
              sx={{
                m: 0,
                ':hover > .MuiListItemIcon-root': { color: color.white },
                ':hover': {
                  backgroundColor: color.hot_red,
                  color: color.white,
                },
              }}
            >
              <ListItemIcon>
                <DeleteOutline />
              </ListItemIcon>
              Delete Course
            </MenuItem>,
          ]}
        />
      </ThemeProvider>
    </div>
  );
}
