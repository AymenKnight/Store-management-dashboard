import CircleAvatar from '@components/circle_avatar';
import './style/index.scss';
import TextButton from '@components/buttons/text_button';
import color from '@assets/styles/color';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { Teacher } from '@services/dataTypes';
import { useState } from 'react';
import { router } from '@services/routes';
import UpdateTeacherModel from '@containers/modals/update_teacher_model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import AlertDialoge from '@components/alert_dialoge';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';

interface TeacherItemProps {
  teacher: Teacher;
}
export default function TeacherItem({ teacher }: TeacherItemProps) {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteTeacherMutation = useMutation({
    mutationFn: () => deleteUser(teacher?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
      handleDeleteClose();
      toast.success('Teacher has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const { modal, close } = useOverlayStore();

  return (
    <div className="teacher-item">
      <CircleAvatar
        src={`${teacher.avatar_url}?${new Date()}`}
        alt={teacher.name}
        width={140}
      />
      <div className="teacher-item-info">
        <span>{teacher.name}</span>
        {teacher.email && <span>{teacher.email} </span>}
      </div>
      <div className="teacher-item-controls">
        <TextButton
          backgroundColor={color.primary}
          afterBgColor={color.good_green}
          radius={'100%'}
          padding={8}
          onPress={() => {
            router.navigate({
              to: '/TEACHERS/$userId',
              params: { userId: teacher?.id },
            });
          }}
          Icon={
            <UserCircleIcon
              width={20}
              height={20}
              stroke={color.white}
              strokeWidth={2}
            />
          }
        />

        <TextButton
          backgroundColor={color.primary}
          afterBgColor={color.good_green}
          radius={'100%'}
          padding={8}
          onPress={() => {
            modal(<UpdateTeacherModel teacher={teacher} />, 'Update Teacher', {
              modalStyle: {
                width: '50%',
              },
            }).open();
          }}
          Icon={
            <PencilSquareIcon
              width={20}
              height={20}
              stroke={color.white}
              strokeWidth={2}
            />
          }
        />

        <TextButton
          backgroundColor={color.primary}
          afterBgColor={color.hot_red}
          radius={'100%'}
          padding={8}
          onPress={handleDeleteOpen}
          Icon={
            <TrashIcon
              width={20}
              height={20}
              stroke={color.white}
              strokeWidth={2}
            />
          }
        />

        <AlertDialoge
          open={openDelete}
          name={'Teacher'}
          onClose={handleDeleteClose}
          deleteMutaion={() => deleteTeacherMutation.mutate()}
        />
      </div>
    </div>
  );
}
