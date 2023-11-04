/* eslint-disable @typescript-eslint/naming-convention */
import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  createChaptersByCourseId,
  updateChapterById,
} from '@services/api/chapter_api/chapter.api';
import { queriesKeys } from '@services/queriesKeys';
import { Chapter } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { useState } from 'react';
import { CustomError } from '@libs/CustomError';
import toast from 'react-hot-toast';
import LoadingSpinner from '@components/loading_spinner';
import Checkbox from '@components/inputs/checkbox';

interface ChapterProps {
  title: string;
  order_number?: number;
  orderNumberEnabled: boolean;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  order_number: z.coerce.number().optional(),
  orderNumberEnabled: z.boolean(),
});

interface AddNewChapterModalProps {
  defaultValues?: Chapter;
  courseId: string;
}
export default function AddNewChapterModal({
  defaultValues,
  courseId,
}: AddNewChapterModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch, reset } = useForm<ChapterProps>({
    defaultValues: {
      title: defaultValues != undefined ? defaultValues.title : '',
      order_number:
        defaultValues != undefined ? defaultValues.order_number : undefined,
      orderNumberEnabled: false,
    },
    resolver: zodResolver(schema),
  });

  const createNewChapterMutation = useMutation({
    mutationFn: createChaptersByCourseId,
    onSuccess: () => {
      console.log('data mutate');
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const updateChapterMutation = useMutation({
    mutationFn: updateChapterById,
    onSuccess: () => {
      console.log('data mutate');
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const [err, setErr] = useState<string>();
  const onSubmit: SubmitHandler<ChapterProps> = async (formData) => {
    console.log('formData', formData);
    if (defaultValues) {
      updateChapterMutation.mutate({
        ...formData,
        chapterId: defaultValues.id,
      });
    } else {
      if (
        formData.orderNumberEnabled &&
        formData.order_number != undefined &&
        formData.order_number > 0
      ) {
        createNewChapterMutation.mutate({
          courseId,
          title: formData.title,
          order_number: Number(formData.order_number),
        });
      } else if (!formData.orderNumberEnabled) {
        createNewChapterMutation.mutate({
          courseId,
          title: formData.title,
        });
      } else {
        setErr('Order number must be valid');
      }
    }
  };

  return (
    <form className="chapter-form" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Title"
        inputBorder={true}
        controllerProps={{
          name: 'title',
          control: control,
        }}
      />

      <div className="order-number-option">
        <Checkbox
          label="Enable this if you want to provide the order number"
          controllerProps={{ name: 'orderNumberEnabled', control: control }}
        />

        {watch('orderNumberEnabled') && (
          <Field
            type="number"
            inputProps={{
              disabled: !watch('orderNumberEnabled'),
              onChange: () => setErr(''),
            }}
            label="Order Number"
            error={err ? err : undefined}
            inputBorder={true}
            controllerProps={{
              name: 'order_number',
              control: control,
            }}
          />
        )}
      </div>
      <div className="form-controls">
        {createNewChapterMutation.isLoading ||
        updateChapterMutation.isLoading ? (
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
