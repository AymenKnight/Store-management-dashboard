import './style/index.scss';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import color from '@assets/styles/color';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import BlueAddButton from '@components/buttons/blue_add_button';
import MemberItem from '@components/member_item';
import {
  AccountCircleOutlined,
  DeleteOutline,
  EditOutlined,
  Rowing,
} from '@mui/icons-material';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Student } from '@services/dataTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, fetchUsers } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import AddStudentModal from '@containers/modals/add_student_modal';
import { router } from '@services/routes';
import UpdateStudentModel from '@containers/modals/update_student_model';
import toast from 'react-hot-toast';
import AlertDialoge from '@components/alert_dialoge';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';

interface StudentsProps {}
export default function Students({}: StudentsProps) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [userId, setUserId] = useState('');
  const queryClient = useQueryClient();
  const { modal, close } = useOverlayStore();

  const {
    data: users,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery<Student[]>({
    queryKey: [queriesKeys.Users],
    queryFn: fetchUsers,
  });
  const students = isSuccess
    ? users.filter((user) => {
        return user.role === 'LEARNER';
      })
    : [];

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row, cell }) => (
          <MemberItem
            name={cell.getValue() as string}
            src={`${row.original.avatar_url}?${new Date()}`}
            id={row.original.id}
          />
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },

      {
        accessorKey: 'phone_number',
        header: 'Phone',
      },
      {
        accessorKey: 'grade.id',
        header: 'Grade',
      },
      {
        accessorKey: 'subject.name',
        header: 'Subject',
      },
    ],
    [],
  );

  const deleteStudentMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
      handleDeleteClose();
      toast.success('Student has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  return (
    <div className="students">
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={students ?? []}
          muiToolbarAlertBannerProps={
            isError
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
          enableRowActions
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
          renderTopToolbarCustomActions={({ table }) => {
            return <BlueAddButton text="New Student" onPress={handleOpen} />;
          }}
          renderRowActionMenuItems={({ closeMenu, row }) => [
            <MenuItem
              key={1}
              onClick={() => {
                router.navigate({
                  to: '/STUDENTS/$userId',
                  params: { userId: row.original.id },
                });
                closeMenu();
              }}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <AccountCircleOutlined />
              </ListItemIcon>
              View Profile
            </MenuItem>,
            <MenuItem
              key={2}
              onClick={() => {
                modal(
                  <UpdateStudentModel student={row.original} />,
                  'Update Student',
                  {
                    modalStyle: {
                      width: '50%',
                    },
                  },
                ).open();
              }}
              sx={{
                m: 0,
                ':hover > .MuiListItemIcon-root': { color: color.white },
                ':hover': {
                  backgroundColor: color.cold_blue,
                  color: color.white,
                },
              }}
            >
              <ListItemIcon>
                <EditOutlined />
              </ListItemIcon>
              Edit Student
            </MenuItem>,
            <MenuItem
              key={3}
              onClick={() => {
                setUserId(row.original.id);
                handleDeleteOpen();
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
              Delete Student
            </MenuItem>,
          ]}
        />
      </ThemeProvider>
      <AlertDialoge
        open={openDelete}
        name={'Student'}
        onClose={handleDeleteClose}
        deleteMutaion={() => deleteStudentMutation.mutate()}
      />
      <AddStudentModal open={open} handleClose={handleClose} />
    </div>
  );
}
