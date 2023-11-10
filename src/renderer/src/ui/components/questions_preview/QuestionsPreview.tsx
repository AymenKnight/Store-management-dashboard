import { question } from '@services/dataTypes';
import TextPair from '@components/text_pair/TextPair';
import './style/index.scss';
import color from '@assets/styles/color';
import TextButton from '@components/buttons/text_button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import QuestionPreviewModal from '@containers/modals/question_preview_modal';
import { useState } from 'react';
import AlertDialoge from '@components/alert_dialoge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuizQuestion } from '@services/api/quiz_api/quiz.api';
import { queriesKeys } from '@services/queriesKeys';
import { CustomError } from '@libs/CustomError';
import toast from 'react-hot-toast';
import ViewQuestionsModal from '@containers/modals/view_questions_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';

interface QuestionsPreviewProps {
  question: question;
  index: number;
  courseId: string;
}
export default function QuestionsPreview({
  question,
  index,
  courseId,
}: QuestionsPreviewProps) {
  const { answers, description, quiz_id } = question;
  const [open, setOpen] = useState(false);
  const { modal, close } = useOverlayStore();

  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteQuestionMutation = useMutation({
    mutationFn: () => deleteQuizQuestion(question.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteQuestionClose();
      toast.success('Question has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteQuestionOpen = () => {
    setOpenDeleteQuestion(true);
  };

  const handleDeleteQuestionClose = () => {
    setOpenDeleteQuestion(false);
  };

  return (
    <div className="questions-preview">
      <div className="video-preview-content">
        <QuizIcon css={{ width: 40, height: 40 }} />
        <TextPair
          first={{
            text: 'Question ' + (index + 1),
            fontColor: color.good_black,
            fontWeight: 600,
            fontSize: 17,
          }}
          second={{
            text: description,
            fontColor: color.navy_blue,
            fontWeight: 600,
            fontSize: 15,
          }}
          gap={5}
        />
      </div>
      <div className="video-preview-controls">
        <TextButton
          onPress={() => {
            modal(<ViewQuestionsModal defaultValues={question} />, 'Question', {
              modalStyle: {
                width: '50%',
              },
            }).open();
          }}
          Icon={<VisibilityIcon css={{ color: 'white', width: 20 }} />}
          backgroundColor={color.good_green}
          fontColor={color.white}
          padding={'5px 8px'}
        />
        <TextButton
          onPress={handleDeleteQuestionOpen}
          backgroundColor={color.hot_red}
          fontColor={color.white}
          padding={'5px 8px'}
          Icon={<DeleteIcon css={{ color: 'white', width: 20 }} />}
        />
      </div>
      <AlertDialoge
        name="Question"
        open={openDeleteQuestion}
        onClose={handleDeleteQuestionClose}
        deleteMutaion={() => deleteQuestionMutation.mutate()}
      />
    </div>
  );
}
