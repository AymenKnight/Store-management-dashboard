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
import { CreateQuiz } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';
import { createQuiz } from '@services/api/quiz_api/quiz.api';

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  questions: z.array(z.any()).optional(),
});

interface AddNewQuizModalProps {
  courseId: string;
  lessonId: string;
}
export default function AddNewQuizModal({
  courseId,
  lessonId,
}: AddNewQuizModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateQuiz>({
    defaultValues: {
      title: '',
      questions: [],
    },
    resolver: zodResolver(schema),
  });

  const createQuizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
      toast.success('New quiz has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<CreateQuiz> = async (formData) => {
    createQuizMutation.mutate({
      lessonId,
      title: formData.title,
      questions: formData.questions,
    });
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Title"
        inputBorder={true}
        controllerProps={{
          name: 'title',
          control: control,
        }}
      />

      <div className="form-controls">
        {createQuizMutation.isLoading ? (
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
              text="Create"
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
