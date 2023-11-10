import './style/index.scss';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import color from '@assets/styles/color';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import BlueAddButton from '@components/buttons/blue_add_button';
import MemberItem from '@components/member_item';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ListItemIcon, MenuItem } from '@mui/material';
import { Course, Offres, OffresRes } from '@services/dataTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotAButton from '@components/not_a_button';
import { z } from 'zod';
import {
  createOffre,
  deleteOffre,
  fetchOffres,
} from '@services/api/offres_api/offres.api';

import toast from 'react-hot-toast';
import AlertDialoge from '@components/alert_dialoge';
import { queriesKeys } from '@services/queriesKeys';
import PopoverText from '@components/popover_text';
import AddOfferModel from '@containers/modals/add_offer_model';
import ViewCoursesModel from '@containers/modals/view_courses_model';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';

interface AnnouncementProps {}
export default function Announcement({}: AnnouncementProps) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [offerId, setOfferId] = useState('');
  const [openCourses, setOpenCourses] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const queryClient = useQueryClient();

  const {
    data: offres,
    isError,
    isFetching,
    isLoading,
  } = useQuery<OffresRes[]>({
    queryKey: [queriesKeys.Offres],
    queryFn: fetchOffres,
  });

  const columns = useMemo<MRT_ColumnDef<OffresRes>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        Cell: ({ row, cell }) => (
          <MemberItem name={cell.getValue() as string} id={row.original.id} />
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'discount',
        header: 'Discount',
        Cell: ({ cell }) => `${cell.getValue<number>()}%`,
      },
      {
        accessorKey: 'end_date',
        header: 'End date',
        Cell: ({ cell }) => cell.getValue<string>().split('T')[0],
      },
      {
        accessorKey: 'offer_type',
        header: 'Offer Type',
        Cell: ({ cell }) =>
          cell.getValue<string>() === 'SINGLE_COURSE' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.cold_blue}
              text="Single Course"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : cell.getValue<string>() === 'PACK_OF_COURSES' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.hot_purple}
              text="Pack Of Courses"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : cell.getValue<string>() === 'ALL_COURSES' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.good_green}
              text="All Courses"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : (
            <></>
          ),
      },
    ],
    [],
  );

  const deleteOffreMutation = useMutation({
    mutationFn: () => deleteOffre(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Offres] });
      handleDeleteClose();
      toast.success('Offer has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  // console.log(formData);
  const handleClickPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const handleOpenCourses = () => {
    setOpenCourses(true);
  };

  const handleCloseCourses = () => {
    setOpenCourses(false);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const { modal, close } = useOverlayStore();
  return (
    <div className="announcement">
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={offres ?? []}
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
            return (
              <BlueAddButton
                text="New Offer"
                onPress={() => {
                  modal(<AddOfferModel />, 'Add New Offer', {
                    modalStyle: {
                      width: '50%',
                    },
                  }).open();
                }}
              />
            );
            // return <button onClick={handleClickOpen}>New Offre</button>;
          }}
          renderRowActionMenuItems={({ closeMenu, row }) => [
            row.original.offer_type === 'ALL_COURSES' ? (
              <MenuItem
                key={1}
                aria-owns={openPopover ? 'simple-popover' : undefined}
                aria-describedby={id}
                aria-haspopup="true"
                onClick={handleClickPopover}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <VisibilityOutlinedIcon />
                </ListItemIcon>
                View Courses
              </MenuItem>
            ) : (
              <MenuItem
                key={2}
                onClick={() => {
                  setCourses(row.original.courses);
                  handleOpenCourses();
                  closeMenu();
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <VisibilityOutlinedIcon />
                </ListItemIcon>
                View Courses
              </MenuItem>
            ),
            <MenuItem
              key={4}
              onClick={() => {
                setOfferId(row.original.id);
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
              Delete Offer
            </MenuItem>,
          ]}
        />
      </ThemeProvider>
      <ViewCoursesModel
        open={openCourses}
        handleClose={handleCloseCourses}
        courses={courses}
      />
      <AlertDialoge
        open={openDelete}
        name={'Offer'}
        onClose={handleDeleteClose}
        deleteMutaion={() => deleteOffreMutation.mutate()}
      />

      <PopoverText
        text="This offer has all the courses"
        open={openPopover}
        id={`${id}`}
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
      />
    </div>
  );
}
