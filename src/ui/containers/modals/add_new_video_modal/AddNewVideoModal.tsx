/* eslint-disable @typescript-eslint/naming-convention */
import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { queriesKeys } from '@services/queriesKeys';
import { video } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  createVideoByLessonId,
  updateVideoByLessonId,
} from '@services/api/video_api/video.api';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';

interface VideoProps {
  title: string;
  videoUrl: string;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  videoUrl: z.string().min(3, 'video url is required'),
});

interface AddNewVideoModalProps {
  defaultValues?: video;
  courseId: string;
  lessonId: string;
}
export default function AddNewVideoModal({
  defaultValues,
  courseId,
  lessonId,
}: AddNewVideoModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VideoProps>({
    defaultValues: {
      title: defaultValues != undefined ? defaultValues.title : '',
      videoUrl: defaultValues != undefined ? defaultValues.url : '',
    },
    resolver: zodResolver(schema),
  });

  const createNewVideoMutation = useMutation({
    mutationFn: createVideoByLessonId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
      toast.success('New video has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const updateVideoMutation = useMutation({
    mutationFn: updateVideoByLessonId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      reset();
      close();
      toast.success('The video has been updated successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const [err, setErr] = useState<string>();
  const onSubmit: SubmitHandler<VideoProps> = async (formData) => {
    if (defaultValues) {
      updateVideoMutation.mutate({
        ...formData,
        lessonId: defaultValues.lesson_id,
      });
    } else {
      createNewVideoMutation.mutate({
        lessonId,
        title: formData.title,
        videoUrl: formData.videoUrl,
      });
    }
  };

  return (
    <form className="video-form" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Title"
        inputBorder={true}
        controllerProps={{
          name: 'title',
          control: control,
        }}
      />

      <Field
        type="text"
        label="Video Url"
        inputBorder={true}
        controllerProps={{
          name: 'videoUrl',
          control: control,
        }}
      />

      <div className="form-controls">
        {createNewVideoMutation.isLoading || updateVideoMutation.isLoading ? (
          <LoadingSpinner height={50} width={50} />
        ) : (
          <>
            <TextButton
              text="Cancel"
              fontColor={color.good_black}
              fontWeight={600}
              padding={'8px 15px'}
              onPress={() => {
                reset();
                close();
              }}
            />
            <TextButton
              text={defaultValues ? 'Update' : 'Create'}
              backgroundColor={color.primary}
              fontColor={color.white}
              padding={'8px 15px'}
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
            />
          </>
        )}
      </div>
    </form>
  );
}
