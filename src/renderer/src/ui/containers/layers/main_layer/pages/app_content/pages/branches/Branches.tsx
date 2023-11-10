import AddItemBox from '@components/add_item_box';
import './style/index.scss';
import StatsItem from '@components/stats_item';
import color from '@assets/styles/color';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteSubject,
  filterSubject,
} from '@services/api/grades_api/grades.api';
import { SubjectRes } from '@services/dataTypes';
import LoadingSpinner from '@components/loading_spinner';
import { ViewportList } from 'react-viewport-list';
import AddBranchModal from '@containers/modals/add_branch_modal';
import { queriesKeys } from '@services/queriesKeys';
import ErrorAlert from '@components/error_alert';
import TextButton from '@components/buttons/text_button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import UpdateBranchModal from '@containers/modals/update_branch_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';
import AlertDialoge from '@components/alert_dialoge';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';

interface BranchesProps {}
export default function Branches({}: BranchesProps) {
  const { modal } = useOverlayStore();
  const [open, setOpen] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const listRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    data: subjects,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery<SubjectRes[]>({
    queryKey: [queriesKeys.Branches],
    queryFn: () => filterSubject(),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSubjectMutation = useMutation({
    mutationFn: () => deleteSubject(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Branches] });
      handleDeleteClose();
      toast.success('Subject has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  console.log('subjects', subjects);
  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  return (
    <div className="branches">
      {isLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isSuccess ? (
        <div className="items-container">
          <AddBranchModal open={open} handleClose={handleClose} />
          {subjects.length <= 0 ? (
            <AddItemBox name="Add Subject" onClick={handleClickOpen} />
          ) : (
            <div className="scroll-container" ref={listRef}>
              <ViewportList
                viewportRef={listRef}
                items={[
                  { id: '', name: 'Add Branch', image_url: '' },
                  ...subjects,
                ]}
              >
                {(item, index) =>
                  index == 0 ? (
                    <AddItemBox
                      key={index}
                      name="Add Subject"
                      onClick={handleClickOpen}
                    />
                  ) : (
                    <StatsItem
                      className="subject-card"
                      key={item.id}
                      name={item?.name}
                      BackgroundSVG={`${item?.image_url}?${new Date()}`}
                      backgroundColor={color.cold_blue}
                    >
                      <div className="subject-item-controls">
                        <TextButton
                          backgroundColor={color.primary}
                          afterBgColor={color.good_green}
                          radius={100}
                          padding={8}
                          onPress={() => {
                            modal(
                              <UpdateBranchModal subject={item} />,
                              'Update Subject',
                              {
                                modalStyle: {
                                  width: '50%',
                                },
                              },
                            ).open();
                          }}
                          Icon={
                            <PencilSquareIcon
                              width={20}
                              height={20}
                              fill={color.white}
                              // strokeWidth={2}
                            />
                          }
                        />
                        <TextButton
                          backgroundColor={color.primary}
                          afterBgColor={color.hot_red}
                          radius={'100%'}
                          padding={8}
                          onPress={() => {
                            setSubjectId(item?.id);
                            handleDeleteOpen();
                          }}
                          Icon={
                            <TrashIcon
                              width={20}
                              height={20}
                              fill={color.white}
                              // strokeWidth={2}
                            />
                          }
                        />
                      </div>
                    </StatsItem>
                  )
                }
              </ViewportList>
            </div>
          )}
        </div>
      ) : (
        isError && (
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
      <AlertDialoge
        name="Subject"
        open={openDelete}
        onClose={handleDeleteClose}
        deleteMutaion={() => deleteSubjectMutation.mutate()}
      />
    </div>
  );
}
