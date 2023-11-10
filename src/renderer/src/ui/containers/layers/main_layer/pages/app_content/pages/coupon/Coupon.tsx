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
import { CouponRes, Coupons, Course } from '@services/dataTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotAButton from '@components/not_a_button';
import toast from 'react-hot-toast';
import { queriesKeys } from '@services/queriesKeys';
import AlertDialoge from '@components/alert_dialoge';
import {
  deleteCoupon,
  fetchCoupons,
} from '@services/api/coupon_api/coupon.api';
import PopoverText from '@components/popover_text';
import AddCouponModel from '@containers/modals/add_coupon_model';
import ViewCoursesModel from '@containers/modals/view_courses_model';
import { useOverlayStore } from '@services/zustand/overlayStore';
import TextPair from '@components/text_pair/TextPair';
import { CustomError } from '@libs/CustomError';

interface CouponProps {}
export default function Coupon({}: CouponProps) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [couponId, setCouponId] = useState('');
  const [openCourses, setOpenCourses] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const queryClient = useQueryClient();

  const {
    data: coupons,
    isError,
    isFetching,
    isLoading,
  } = useQuery<CouponRes[]>({
    queryKey: [queriesKeys.Coupons],
    queryFn: fetchCoupons,
  });

  const columns = useMemo<MRT_ColumnDef<CouponRes>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'code',
        header: 'Code',
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
        accessorKey: 'max_uses',
        header: 'Max of uses',
        Cell: ({ cell }) => `${cell.getValue<number>()} times`,
      },
      {
        accessorKey: 'userCoupon',
        header: 'Number of uses',
        Cell: ({ row }) =>
          row.original.userCoupon.length > 0
            ? `${row.original.userCoupon.length} took this coupon`
            : 'No one took this coupon',
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
    mutationFn: () => deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Coupons] });
      handleDeleteClose();
      toast.success('Coupon has been deleted successfully');
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
    <div className="coupon">
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={coupons ?? []}
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
                text="New Coupon"
                onPress={() => {
                  modal(<AddCouponModel />, 'Add New Coupon', {
                    modalStyle: {
                      width: '50%',
                    },
                  }).open();
                }}
              />
            );
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
                setCouponId(row.original.id);
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
              Delete Coupon
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
        onClose={handleDeleteClose}
        name={'Coupon'}
        deleteMutaion={() => deleteOffreMutation.mutate()}
      />
      <PopoverText
        text="This coupon has all the courses"
        open={openPopover}
        id={`${id}`}
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
      />
    </div>
  );
}
