import Field from '@components/inputs/field';
import './style/index.scss';
import CreateModel from '../create_model';
import { question } from '@services/dataTypes';
import color from '@assets/styles/color';
import TextButton from '@components/buttons/text_button';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectField from '@components/inputs/select_field';
import Header from '@components/header';
import { useOverlayStore } from '@services/zustand/overlayStore';
import Checkbox from '@components/inputs/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuizQuestion } from '@services/api/quiz_api/quiz.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';

const schema = z.object({
  description: z.string().min(8, 'description is required'),
  answer1: z.string().min(1, 'Answer is required'),
  answer2: z.string().min(1, 'Answer is required'),
  answer3: z.string().min(1, 'Answer is required'),
  answer4: z.string().min(1, 'Answer is required'),
  isCorrectAnswer1: z.boolean(),
  isCorrectAnswer2: z.boolean(),
  isCorrectAnswer3: z.boolean(),
  isCorrectAnswer4: z.boolean(),
});

interface QuestionProps {
  description: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  isCorrectAnswer1: boolean;
  isCorrectAnswer2: boolean;
  isCorrectAnswer3: boolean;
  isCorrectAnswer4: boolean;
}

interface QuestionPreviewModalProps {
  courseId: string;
  quizId: string;
}
export default function QuestionPreviewModal({
  courseId,
  quizId,
}: QuestionPreviewModalProps) {
  const queryClient = useQueryClient();
  const { close } = useOverlayStore();

  const { control, handleSubmit } = useForm<QuestionProps>({
    defaultValues: {
      description: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      isCorrectAnswer1: false,
      isCorrectAnswer2: false,
      isCorrectAnswer3: false,
      isCorrectAnswer4: false,
    },
    resolver: zodResolver(schema),
  });
  const {
    mutate: createQuizQuestionMutation,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: createQuizQuestion,
    onSuccess: () => {
      console.log('data mutate');
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      close();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const onSubmit: SubmitHandler<QuestionProps> = async (formData) => {
    console.log(formData);

    await createQuizQuestionMutation({
      description: formData.description,
      quizId,
      answers: [
        {
          description: formData.answer1,
          is_correct: formData.isCorrectAnswer1,
        },
        {
          description: formData.answer2,
          is_correct: formData.isCorrectAnswer2,
        },
        {
          description: formData.answer3,
          is_correct: formData.isCorrectAnswer3,
        },
        {
          description: formData.answer4,
          is_correct: formData.isCorrectAnswer4,
        },
      ],
    });
  };
  return (
    <div className="question-preview-content">
      <Field
        type="text"
        label="Question"
        inputBorder={true}
        controllerProps={{
          name: 'description',
          control: control,
        }}
      />

      <div className="answers-container">
        <Header
          title={{
            text: 'Answers',
            fontColor: color.good_black,
            fontWeight: 600,
            fontSize: 26,
          }}
        />
        <div className="answers-container-inputs">
          <div className="answer-input">
            <Field
              type="text"
              label="Answer 1"
              inputBorder={true}
              controllerProps={{
                name: 'answer1',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              controllerProps={{
                name: 'isCorrectAnswer1',
                control: control,
              }}
            />
          </div>
          <div className="answer-input">
            <Field
              type="text"
              label="Answer 2"
              inputBorder={true}
              controllerProps={{
                name: 'answer2',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              controllerProps={{
                name: 'isCorrectAnswer2',
                control: control,
              }}
            />
          </div>
          <div className="answer-input">
            <Field
              type="text"
              label="Answer 3"
              inputBorder={true}
              controllerProps={{
                name: 'answer3',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              controllerProps={{
                name: 'isCorrectAnswer3',
                control: control,
              }}
            />
          </div>
          <div className="answer-input">
            <Field
              type="text"
              label="Answer 4"
              inputBorder={true}
              controllerProps={{
                name: 'answer4',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              controllerProps={{
                name: 'isCorrectAnswer4',
                control: control,
              }}
            />
          </div>
        </div>
      </div>
      <div className="form-controls">
        <TextButton
          text="Close"
          // backgroundColor={color.hot_red}
          fontColor={color.good_black}
          fontWeight={600}
          padding={'8px 15px'}
          onPress={() => {
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
      </div>
    </div>
  );
}
