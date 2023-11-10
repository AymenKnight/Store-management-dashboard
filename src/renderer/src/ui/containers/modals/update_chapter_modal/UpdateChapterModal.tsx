/* eslint-disable @typescript-eslint/naming-convention */
import TextButton from '@components/buttons/text_button';
import CreateModel from '../create_model';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createChaptersByCourseId } from '@services/api/chapter_api/chapter.api';
import { queriesKeys } from '@services/queriesKeys';
import { CustomError } from '@libs/CustomError';
import toast from 'react-hot-toast';
import Checkbox from '@components/inputs/checkbox';

interface ChapterProps {
  title: string;
  order_number: number;
  orderNumberEnabled: boolean;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  order_number: z.optional(z.string()),
  orderNumberEnabled: z.boolean(),
});

interface UpdateChapterModalProps {
  open: boolean;
  handleClose: () => void;
  courseId: string;
}
export default function UpdateChapterModal({
  handleClose,
  open,
  courseId,
}: UpdateChapterModalProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch, reset } = useForm<ChapterProps>({
    defaultValues: {
      title: '',
      order_number: 0,
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
      handleClose();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const onSubmit: SubmitHandler<ChapterProps> = async (formData) => {
    console.log('formData', formData);

    if (formData.orderNumberEnabled) {
      createNewChapterMutation.mutate({
        courseId,
        title: formData.title,
        order_number: Number(formData.order_number),
      });
    } else {
      createNewChapterMutation.mutate({
        courseId,
        title: formData.title,
      });
    }
  };

  return (
    <CreateModel
      title={'Add New Chapter'}
      open={open}
      handleClose={handleClose}
      width={'30%'}
      className="update-chapter-modal"
      controls={
        <>
          <TextButton
            text="Cancel"
            // backgroundColor={color.hot_red}
            fontColor={color.good_black}
            fontWeight={600}
            padding={'8px 15px'}
            onPress={() => {
              reset();
              handleClose();
            }}
          />
          <TextButton
            text={'Create'}
            backgroundColor={color.primary}
            fontColor={color.white}
            padding={'8px 15px'}
            onPress={() => {
              handleSubmit(onSubmit)();
            }}
          />
        </>
      }
    >
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

          <Field
            type="number"
            inputProps={{ disabled: !watch('orderNumberEnabled') }}
            label="Order Number"
            inputBorder={true}
            controllerProps={{
              name: 'order_number',
              control: control,
            }}
          />
        </div>
      </form>
    </CreateModel>
  );
}
