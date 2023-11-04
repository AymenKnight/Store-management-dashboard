import TextPair from '@components/text_pair/TextPair';
import './style/index.scss';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import color from '@assets/styles/color';
import TextButton from '@components/buttons/text_button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddNewVideoModal from '@containers/modals/add_new_video_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { video } from '@services/dataTypes';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVideo } from '@services/api/video_api/video.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import AlertDialoge from '@components/alert_dialoge';
import { CustomError } from '@libs/CustomError';

interface VideoPreviewProps {
  courseId: string;
  lessonId: string;
  video: video;
}
export default function VideoPreview({
  courseId,
  lessonId,
  video,
}: VideoPreviewProps) {
  const { modal, close } = useOverlayStore();
  const [openDeleteVideo, setOpenDeleteVideo] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteVideoMutation = useMutation({
    mutationFn: () =>
      deleteVideo({
        title: video.title,
        videoUrl: video.url,
        lessonId: video.lesson_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteVideoClose();
      toast.success('Video has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteVideoOpen = () => {
    setOpenDeleteVideo(true);
  };

  const handleDeleteVideoClose = () => {
    setOpenDeleteVideo(false);
  };

  return (
    <div className="video-preview">
      <div className="video-preview-content">
        <OndemandVideoOutlinedIcon css={{ width: 40, height: 40 }} />
        <TextPair
          first={{
            text: video.title,
            fontColor: color.good_black,
            fontWeight: 600,
            fontSize: 17,
          }}
          second={
            <span className="video-preview-link">
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                {video.url}
              </a>
            </span>
          }
          gap={0}
        />
      </div>
      <div className="video-preview-controls">
        <TextButton
          onPress={() => {
            modal(
              <AddNewVideoModal
                courseId={courseId}
                lessonId={lessonId}
                defaultValues={video}
              />,
              'Update Video',
              {
                modalStyle: {
                  width: '50%',
                },
              },
            ).open();
          }}
          Icon={<EditIcon css={{ color: 'white', width: 20 }} />}
          backgroundColor={color.primary}
          fontColor={color.white}
          padding={'5px 8px'}
        />
        <TextButton
          onPress={handleDeleteVideoOpen}
          backgroundColor={color.hot_red}
          fontColor={color.white}
          padding={'5px 8px'}
          Icon={<DeleteIcon css={{ color: 'white', width: 20 }} />}
        />
        <AlertDialoge
          name="Video"
          open={openDeleteVideo}
          onClose={handleDeleteVideoClose}
          deleteMutaion={() => deleteVideoMutation.mutate()}
        />
      </div>
    </div>
  );
}
