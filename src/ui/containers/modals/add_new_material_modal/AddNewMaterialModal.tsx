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
import { material } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  createMaterialByLessonId,
  updateMaterialById,
} from '@services/api/material_api/material.api';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';

interface MaterialProps {
  title: string;
  content: string;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  content: z.string().min(3, 'content url is required'),
});

interface AddNewMaterialModalProps {
  defaultValues?: material;
  courseId: string;
  lessonId: string;
}
export default function AddNewMaterialModal({
  defaultValues,
  courseId,
  lessonId,
}: AddNewMaterialModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MaterialProps>({
    defaultValues: {
      title: defaultValues != undefined ? defaultValues.title : '',
      content: defaultValues != undefined ? defaultValues.content : '',
    },
    resolver: zodResolver(schema),
  });

  const createNewMaterialMutation = useMutation({
    mutationFn: createMaterialByLessonId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
      toast.success('New material has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const updateMaterialMutation = useMutation({
    mutationFn: updateMaterialById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      reset();
      close();
      toast.success('The material has been updated successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const [err, setErr] = useState<string>();
  const onSubmit: SubmitHandler<MaterialProps> = async (formData) => {
    if (defaultValues) {
      updateMaterialMutation.mutate({
        ...formData,
        lessonId: defaultValues.lesson_id,
        materialId: defaultValues.id,
      });
    } else {
      createNewMaterialMutation.mutate({
        lessonId,
        title: formData.title,
        content: formData.content,
      });
    }
  };

  return (
    <form className="material-form" onSubmit={handleSubmit(onSubmit)}>
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
        label="Content Url"
        inputBorder={true}
        controllerProps={{
          name: 'content',
          control: control,
        }}
      />

      <div className="form-controls">
        {createNewMaterialMutation.isLoading ||
        updateMaterialMutation.isLoading ? (
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
