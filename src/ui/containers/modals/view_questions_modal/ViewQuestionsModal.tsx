import Field from '@components/inputs/field';
import './style/index.scss';
import color from '@assets/styles/color';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@components/header';
import { useOverlayStore } from '@services/zustand/overlayStore';
import Checkbox from '@components/inputs/checkbox';
import TextButton from '@components/buttons/text_button';
import { question } from '@services/dataTypes';

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

interface ViewQuestionsModalProps {
  defaultValues: question;
}
export default function ViewQuestionsModal({
  defaultValues,
}: ViewQuestionsModalProps) {
  const { close } = useOverlayStore();

  const { control } = useForm<QuestionProps>({
    defaultValues: {
      description: defaultValues.description,
      answer1: defaultValues.answers[0].description,
      answer2: defaultValues.answers[1].description,
      answer3: defaultValues.answers[2].description,
      answer4: defaultValues.answers[3].description,
      isCorrectAnswer1: defaultValues.answers[0].is_correct,
      isCorrectAnswer2: defaultValues.answers[1].is_correct,
      isCorrectAnswer3: defaultValues.answers[2].is_correct,
      isCorrectAnswer4: defaultValues.answers[3].is_correct,
    },
    resolver: zodResolver(schema),
  });

  return (
    <div className="question-preview-content">
      <Field
        type="text"
        label="Question"
        inputBorder={true}
        inputProps={{ disabled: true }}
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
              inputProps={{ disabled: true }}
              controllerProps={{
                name: 'answer1',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              inputProps={{ disabled: true }}
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
              inputProps={{ disabled: true }}
              controllerProps={{
                name: 'answer2',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              inputProps={{ disabled: true }}
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
              inputProps={{ disabled: true }}
              controllerProps={{
                name: 'answer3',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              inputProps={{ disabled: true }}
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
              inputProps={{ disabled: true }}
              controllerProps={{
                name: 'answer4',
                control: control,
              }}
            />
            <Checkbox
              label="Is correct?"
              inputProps={{ disabled: true }}
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
          backgroundColor={color.primary}
          fontColor={color.white}
          fontWeight={600}
          padding={'8px 15px'}
          onPress={() => {
            close();
          }}
        />
      </div>
    </div>
  );
}
