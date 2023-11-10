import TeacherItem from '@components/teacher_item';
import './style/index.scss';
import BlueAddButton from '@components/buttons/blue_add_button';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@services/api/user_api/user.api';
import LoadingSpinner from '@components/loading_spinner';
import { useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import { Teacher } from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import AddTeacherModal from '@containers/modals/add_teacher_modal';
import ErrorAlert from '@components/error_alert';

interface TeachersProps {}

export default function Teachers({}: TeachersProps) {
  const [open, setOpen] = useState(false);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery<Teacher[]>({
    queryKey: [queriesKeys.Users],
    queryFn: fetchUsers,
  });
  const teachers = users?.filter((user) => {
    return user.role === 'TEACHER';
  });

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="teachers">
      {isLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isSuccess ? (
        <>
          <div className="items-container">
            <div className="header-button-wrapper">
              <BlueAddButton text="New Teacher" onPress={handleClickOpen} />
            </div>
            <AddTeacherModal open={open} handleClose={handleClose} />
            <div className="scroll-container" ref={ref}>
              <ViewportList viewportRef={ref} items={teachers}>
                {(item, index) => <TeacherItem key={index} teacher={item} />}
              </ViewportList>
            </div>
          </div>
        </>
      ) : (
        isError && (
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
    </div>
  );
}
