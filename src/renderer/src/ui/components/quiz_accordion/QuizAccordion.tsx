import './style/index.scss';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';
import color from '@assets/styles/color';
import Header from '@components/header';
import { quiz } from '@services/dataTypes';
import BlueAddButton from '@components/buttons/blue_add_button';
import TextPair from '@components/text_pair/TextPair';
import TextButton from '@components/buttons/text_button';
import QuestionsPreview from '@components/questions_preview';
import { useOverlayStore } from '@services/zustand/overlayStore';
import QuestionPreviewModal from '@containers/modals/question_preview_modal';
import AddNewQuizModal from '@containers/modals/add_new_quiz_modal';
import AlertDialoge from '@components/alert_dialoge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuiz } from '@services/api/quiz_api/quiz.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';
import DeleteIcon from '@mui/icons-material/Delete';
interface QuizAccordionProps {
  headerNode?: ReactNode;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  expanded: boolean;
  quizzes: quiz[];
  id: string;
  courseId: string;
}
export default function QuizAccordion({
  headerNode,
  quizzes,
  onChange,
  expanded,
  id,
  courseId,
}: QuizAccordionProps) {
  const [quizExpanded, setQuizExpanded] = useState<string | false>('quizId');
  const handleQuizChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setQuizExpanded(newExpanded ? panel : false);
    };
  const { modal, close } = useOverlayStore();
  const [quizId, setQuizId] = useState<string>('');
  const [openDeleteQuiz, setOpenDeleteQuiz] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteQuizMutation = useMutation({
    mutationFn: () => deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteQuizClose();
      toast.success('Quiz has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteQuizOpen = () => {
    setOpenDeleteQuiz(true);
  };

  const handleDeleteQuizClose = () => {
    setOpenDeleteQuiz(false);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      className="quiz-accordion"
    >
      <AccordionSummary
        aria-controls={`panel${id}d-content`}
        id={`panel${id}d-header`}
      >
        <Header
          title={{
            text: 'Quizzes',
            fontColor: color.primary,
            fontWeight: 600,
            fontSize: 18,
          }}
          flexGrow={1}
          buttonNode={headerNode}
        />
      </AccordionSummary>
      <AccordionDetails className="panel-details">
        {quizzes.length > 0 ? (
          <>
            <div className="header-button-wrapper">
              <BlueAddButton
                text="Add New Quiz"
                onPress={() => {
                  modal(
                    <AddNewQuizModal courseId={courseId} lessonId={id} />,
                    'Add New Quiz',
                    {
                      modalStyle: {
                        width: '50%',
                      },
                    },
                  ).open();
                }}
              />
            </div>
            <div className="material-list">
              {quizzes.map((quiz, index) => (
                <Accordion
                  key={index}
                  expanded={quizExpanded === `quizId${quiz.id}`}
                  onChange={handleQuizChange(`quizId${quiz.id}`)}
                  className="custom-accordion"
                >
                  <AccordionSummary
                    aria-controls={`panel${id}d-content`}
                    id={`panel${id}d-header`}
                  >
                    <Header
                      title={{
                        text: 'Quiz ' + (index + 1),
                        fontColor: color.primary,
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                      flexGrow={1}
                      buttonNode={
                        <div className="quiz-controls">
                          <TextButton
                            onPress={() => {
                              setQuizId(quiz.id);
                              handleDeleteQuizOpen();
                            }}
                            backgroundColor={color.hot_red}
                            fontColor={color.white}
                            padding={'5px 8px'}
                            Icon={
                              <DeleteIcon css={{ color: 'white', width: 20 }} />
                            }
                          />
                        </div>
                      }
                    />
                  </AccordionSummary>
                  <AccordionDetails className="panel-details">
                    {quiz.questions.length > 0 ? (
                      <>
                        <div className="header-button-wrapper">
                          <BlueAddButton
                            text="Add New Question"
                            onPress={() => {
                              modal(
                                <QuestionPreviewModal
                                  courseId={courseId}
                                  quizId={quiz.id}
                                />,
                                'Add New Question',
                                {
                                  modalStyle: {
                                    width: '50%',
                                  },
                                },
                              ).open();
                            }}
                          />
                        </div>
                        <div className="material-list">
                          {quiz.questions.map((qst, index) => (
                            <QuestionsPreview
                              key={qst.id}
                              index={index}
                              question={qst}
                              courseId={courseId}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <TextPair
                        first={{
                          text: 'No Questions yet, you can start adding a question by clicking the button below',
                          fontColor: color.good_black,
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                        second={
                          <BlueAddButton
                            text="Add New Question"
                            onPress={() => {
                              modal(
                                <QuestionPreviewModal
                                  courseId={courseId}
                                  quizId={quiz.id}
                                />,
                                'Add New Question',
                                {
                                  modalStyle: {
                                    width: '50%',
                                  },
                                },
                              ).open();
                            }}
                          />
                        }
                        gap={10}
                        alignItems="center"
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </>
        ) : (
          <TextPair
            first={{
              text: 'No Quizzes yet, you can start adding a quiz by clicking the button below',
              fontColor: color.good_black,
              fontWeight: 600,
              fontSize: 16,
            }}
            second={
              <BlueAddButton
                text="Add New Quiz"
                onPress={() => {
                  modal(
                    <AddNewQuizModal courseId={courseId} lessonId={id} />,
                    'Add New Quiz',
                    {
                      modalStyle: {
                        width: '50%',
                      },
                    },
                  ).open();
                }}
              />
            }
            gap={10}
            alignItems="center"
          />
        )}
      </AccordionDetails>
      <AlertDialoge
        name="Quiz"
        open={openDeleteQuiz}
        onClose={handleDeleteQuizClose}
        deleteMutaion={() => deleteQuizMutation.mutate()}
      />
    </Accordion>
  );
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: color.white,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
