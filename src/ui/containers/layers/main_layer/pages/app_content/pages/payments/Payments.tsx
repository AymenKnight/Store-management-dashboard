import './style/index.scss';
import { AccountCircleOutlined, DeleteOutline } from '@mui/icons-material';
import { Box, Button, ListItemIcon, MenuItem } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import color from '@assets/styles/color';
import { ThemeProvider } from '@mui/material';
import { theme } from '@assets/styles/theme';
import MemberItem from '@components/member_item';
import { Order, Course } from '@services/dataTypes';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextButton from '@components/buttons/text_button';
import NotAButton from '@components/not_a_button';
import { useQuery } from '@tanstack/react-query';
import { queriesKeys } from '@services/queriesKeys';
import { fetchOrders } from '@services/api/payments_api/payments.api';
import ViewCoursesModel from '@containers/modals/view_courses_model';
import BlueAddButton from '@components/buttons/blue_add_button';
import { useOverlayStore } from '@services/zustand/overlayStore';
import AddOrderModal from '@containers/modals/add_order_modal';

interface PaymentsProps {}
export default function Payments({}: PaymentsProps) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const { modal } = useOverlayStore();
  const {
    data: orders,
    isError,
    isFetching,
    isLoading,
  } = useQuery<Order[]>({
    queryKey: [queriesKeys.Orders],
    queryFn: fetchOrders,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'client',
        header: 'Client',
        enableClickToCopy: true,
        Cell: ({ row }) => (
          <MemberItem
            name={row.original.client.name}
            src={`${row.original.client.avatar}?${new Date()}`}
            id={row.original.client.id}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableClickToCopy: true,
        Cell: ({ cell }) =>
          cell.getValue<string>() === 'PENDING' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.cold_blue}
              text="PENDING"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : cell.getValue<string>() === 'CANCELLED' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.hot_red}
              text="CANCELLED"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : cell.getValue<string>() === 'PAID' ? (
            <NotAButton
              color={color.white}
              backgroundColor={color.good_green}
              text="PAID"
              fontSize={12}
              fontWeight={700}
              padding={'5px 8px'}
            />
          ) : (
            <></>
          ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        enableClickToCopy: true,
      },

      // {
      //   accessorKey: 'couponId',
      //   header: 'Coupon',
      // },
      {
        accessorKey: 'mode',
        header: 'Payment method',
        enableClickToCopy: false,
        Cell: ({ renderedCellValue, row, cell }) => (
          <NotAButton
            text={row.original.mode}
            fontColor={color.good_green}
            backgroundColor={'rgba(229, 241, 248, 1)'}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        enableClickToCopy: true,
        Cell: ({ cell }) =>
          new Date(cell.getValue<Date>()).toLocaleDateString(),
        filterFn: 'lessThanOrEqualTo',
        sortingFn: 'datetime',
        Filter: ({ column }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(newValue) => {
                column.setFilterValue(newValue);
              }}
              slotProps={{
                textField: {
                  helperText: 'Filter Mode: Less Than',
                  sx: { minWidth: '120px' },
                  variant: 'standard',
                },
              }}
              value={column.getFilterValue()}
            />
          </LocalizationProvider>
        ),
      },
      {
        accessorKey: 'course',
        header: 'Courses',
        enableClickToCopy: false,
        Cell: ({ cell }) => (
          <TextButton
            text="View Courses"
            backgroundColor={color.primary}
            afterBgColor={color.good_green}
            fontColor={color.white}
            fontSize={12}
            onPress={() => {
              handleOpen();
              setCourses(cell.getValue<Course[]>());
            }}
          />
        ),
      },
      {
        accessorKey: 'invoice_number',
        header: 'Invoice Number',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'document_url',
        header: 'Invoice document',

        Cell: ({ cell }) => (
          <span className="document-preview-link ">
            <a
              href={cell.getValue<string>()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cell.getValue<string>()}
            </a>
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="payments">
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={orders ?? []}
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
          enableColumnFilterModes
          enableGrouping
          enablePinning
          // enableRowActions
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
                text="Add Order"
                onPress={() => {
                  modal(<AddOrderModal />, 'Add New Order', {
                    modalStyle: {
                      width: '50%',
                    },
                  }).open();
                }}
              />
            );
          }}
        />
      </ThemeProvider>
      <ViewCoursesModel
        open={open}
        handleClose={handleClose}
        courses={courses}
      />
    </div>
  );
}
