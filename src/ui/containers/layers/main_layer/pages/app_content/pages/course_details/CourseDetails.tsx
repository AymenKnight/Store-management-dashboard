import MemberItem from '@components/member_item';
import './style/index.scss';
import NotAButton from '@components/not_a_button';
import color from '@assets/styles/color';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createChaptersByCourseId,
  deleteChapter,
} from '@services/api/chapter_api/chapter.api';
import LoadingSpinner from '@components/loading_spinner';
import {
  Chapter,
  ChapterRes,
  Course,
  UpdateChapter,
} from '@services/dataTypes';
import TextButton from '@components/buttons/text_button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouterState } from '@tanstack/react-router';
import { fetchCourseById } from '@services/api/course_api/course.api';
import { queriesKeys } from '@services/queriesKeys';
import EditIcon from '@mui/icons-material/Edit';
import CourseOverview from '@components/course_overview';
import Header from '@components/header';
import BlueAddButton from '@components/buttons/blue_add_button';
import VideoPreview from '@components/video_preview';
import MaterialAccordion from '@components/material_accordion';
import TextPair from '@components/text_pair/TextPair';
import QuizAccordion from '@components/quiz_accordion';
import AddNewChapterModal from '@containers/modals/add_new_chapter_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';
import AlertDialoge from '@components/alert_dialoge';
import AddNewLessonModel from '@containers/modals/add_new_lesson_model';
import { deleteLesson } from '@services/api/lesson_api/lesson.api';
import AddNewVideoModal from '@containers/modals/add_new_video_modal';
import { CustomError } from '@libs/CustomError';

const schema = z.object({
  courseId: z.string(),
  title: z.string(),
});

interface CourseDetailsProps {}
export default function CourseDetails({}: CourseDetailsProps) {
  const {
    location: { pathname },
  } = useRouterState();

  const courseId = pathname.split('/')[2];

  const [expanded, setExpanded] = useState<string | false>('chapter');
  const [lessonExpanded, setLessonExpanded] = useState<string | false>(
    'lesson',
  );
  const [materialExpanded, setMaterialExpanded] = useState<string | false>(
    'material',
  );
  const [quizExpanded, setQuizExpanded] = useState<string | false>('quiz');
  const [open, setOpen] = useState<string | false>(false);
  const queryClient = useQueryClient();

  const [openDeleteChapter, setOpenDeleteChapter] = useState<boolean>(false);
  const [chapterId, setChapterId] = useState<string>('');

  const [openDeleteLesson, setOpenDeleteLesson] = useState<boolean>(false);
  const [lessonId, setLessonId] = useState<string>('');

  const handleChapterChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const handleLessonChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setLessonExpanded(newExpanded ? panel : false);
    };
  const handleQuizChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setQuizExpanded(newExpanded ? panel : false);
    };

  const handleMaterialChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setMaterialExpanded(newExpanded ? panel : false);
    };
  const { modal, close } = useOverlayStore();
  const {
    data: courseData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery<Course>({
    queryKey: [queriesKeys.Course, courseId],
    queryFn: () => fetchCourseById(courseId),
  });

  const sortedChapters =
    isSuccess && courseData
      ? courseData.chapters
          ?.slice()
          .sort((a, b) => a.order_number - b.order_number)
      : [];

  const createChapterMutation = useMutation({
    mutationFn: createChaptersByCourseId,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['chapters'] });
      // toast.success('Chapter has been created successfully');
      // reset();
      // handleClose();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<Chapter> = (formData) => {
    createChapterMutation.mutate(formData);
    // console.log(formData);
  };

  // start chapter delete
  const deleteChapterMutation = useMutation({
    mutationFn: () => deleteChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteChapterClose();
      toast.success('Chapter has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteChapterOpen = () => {
    setOpenDeleteChapter(true);
  };

  const handleDeleteChapterClose = () => {
    setOpenDeleteChapter(false);
  };
  // end chapter delete

  // start lesson delete
  const deleteLessonMutation = useMutation({
    mutationFn: () => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteLessonClose();
      toast.success('Lesson has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteLessonOpen = () => {
    setOpenDeleteLesson(true);
  };

  const handleDeleteLessonClose = () => {
    setOpenDeleteLesson(false);
  };
  // end lesson delete

  return (
    <>
      <div className="course-details">
        {isLoading ? (
          <div className="loading-wrapper">
            <LoadingSpinner height={100} width={100} />
          </div>
        ) : isSuccess && courseData ? (
          <>
            <CourseOverview
              id={courseData.id}
              title={courseData.title}
              description={courseData.description}
              price={courseData.price}
              image_url={courseData.image_url}
              teacher={courseData.teacher}
              grade={courseData.grade}
              subject={courseData.subject}
              duration={courseData.duration}
              rating={courseData.rating}
              topRated={!!courseData.topRated}
              popular={!!courseData.popular}
              createdAt={courseData.createdAt}
              semester={courseData.semester}
              course={courseData}
            />

            <div className="content-container">
              <Header
                title={{
                  text: 'Course Content',
                  fontColor: color.secondary,
                  fontWeight: 600,
                  fontSize: 30,
                }}
                buttonNode={
                  courseData.chapters.length > 0 && (
                    <BlueAddButton
                      text="Add New Chapter"
                      onPress={() => {
                        modal(
                          <AddNewChapterModal courseId={courseId} />,
                          'Add New Chapter',
                          {
                            modalStyle: {
                              width: '50%',
                            },
                          },
                        ).open();
                      }}
                    />
                  )
                }
              />

              {courseData.chapters.length === 0 && (
                <div className="no-chapter-wrapper">
                  <TextPair
                    first={{
                      text: 'No Chapter yet, you can start adding chapter by clicking the button below',
                      fontColor: color.good_black,
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                    second={
                      <BlueAddButton
                        text="Add New Chapter"
                        onPress={() => {
                          modal(
                            <AddNewChapterModal courseId={courseId} />,
                            'Add New Chapter',
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
                </div>
              )}
              <div className="chapters-container">
                {sortedChapters.map((chapter, index) => (
                  <div key={index}>
                    <Accordion
                      expanded={expanded === `chapter${chapter?.order_number}`}
                      onChange={handleChapterChange(
                        `chapter${chapter?.order_number}`,
                      )}
                    >
                      <AccordionSummary
                        aria-controls={`chapter${chapter?.order_number}d-content`}
                        id={`chapter${chapter?.order_number}d-header`}
                      >
                        <Header
                          title={{
                            text: chapter.title,
                            fontColor: color.primary,
                            fontWeight: 600,
                            fontSize: 18,
                          }}
                          flexGrow={1}
                          buttonNode={
                            <div className="chapter-controls">
                              <TextButton
                                onPress={() => {
                                  modal(
                                    <AddNewChapterModal
                                      courseId={courseId}
                                      defaultValues={chapter}
                                    />,
                                    'Update Chapter',
                                    {
                                      modalStyle: {
                                        width: '50%',
                                      },
                                    },
                                  ).open();
                                }}
                                Icon={
                                  <EditIcon
                                    css={{ color: 'white', width: 20 }}
                                  />
                                }
                                backgroundColor={color.primary}
                                fontColor={color.white}
                                padding={'5px 8px'}
                              />
                              <TextButton
                                onPress={() => {
                                  setChapterId(chapter.id);
                                  handleDeleteChapterOpen();
                                }}
                                backgroundColor={color.hot_red}
                                fontColor={color.white}
                                padding={'5px 8px'}
                                Icon={
                                  <DeleteIcon
                                    css={{ color: 'white', width: 20 }}
                                  />
                                }
                              />
                            </div>
                          }
                        />
                      </AccordionSummary>
                      <AccordionDetails className="chapter-details">
                        {chapter.lessons.length > 0 ? (
                          <>
                            <div className="header-button-wrapper">
                              <BlueAddButton
                                text="Add New Lesson"
                                onPress={() => {
                                  modal(
                                    <AddNewLessonModel
                                      courseId={courseId}
                                      chapterId={chapter.id}
                                    />,
                                    'Add New Lesson',
                                    {
                                      modalStyle: {
                                        width: '50%',
                                      },
                                    },
                                  ).open();
                                }}
                              />
                            </div>
                            <div>
                              {chapter.lessons.map((lesson, index) => (
                                <Accordion
                                  key={index}
                                  expanded={
                                    lessonExpanded ===
                                    `lesson${lesson.order_number}`
                                  }
                                  onChange={handleLessonChange(
                                    `lesson${lesson.order_number}`,
                                  )}
                                >
                                  <AccordionSummary
                                    aria-controls={`lesson${lesson.order_number}d-content`}
                                    id={`lesson${lesson.order_number}d-header`}
                                  >
                                    <Header
                                      title={{
                                        text: lesson.title,
                                        fontColor: color.primary,
                                        fontWeight: 600,
                                        fontSize: 18,
                                      }}
                                      flexGrow={1}
                                      buttonNode={
                                        <div className="chapter-controls">
                                          <TextButton
                                            onPress={() => {
                                              modal(
                                                <AddNewLessonModel
                                                  courseId={courseId}
                                                  chapterId={lesson.chapter_id}
                                                  defaultValues={lesson}
                                                />,
                                                'Update Lesson',
                                                {
                                                  modalStyle: {
                                                    width: '50%',
                                                  },
                                                },
                                              ).open();
                                            }}
                                            Icon={
                                              <EditIcon
                                                css={{
                                                  color: 'white',
                                                  width: 20,
                                                }}
                                              />
                                            }
                                            backgroundColor={color.primary}
                                            fontColor={color.white}
                                            padding={'5px 8px'}
                                          />
                                          <TextButton
                                            onPress={() => {
                                              setLessonId(lesson.id);
                                              handleDeleteLessonOpen();
                                            }}
                                            backgroundColor={color.hot_red}
                                            fontColor={color.white}
                                            padding={'5px 8px'}
                                            Icon={
                                              <DeleteIcon
                                                css={{
                                                  color: 'white',
                                                  width: 20,
                                                }}
                                              />
                                            }
                                          />
                                        </div>
                                      }
                                    />
                                  </AccordionSummary>
                                  <AccordionDetails className="lesson-details">
                                    {lesson.video ? (
                                      <VideoPreview
                                        courseId={courseId}
                                        lessonId={lesson.id}
                                        video={lesson.video}
                                      />
                                    ) : (
                                      <div css={{ marginBottom: '10px' }}>
                                        <TextPair
                                          first={{
                                            text: 'No Video yet, you can start adding video by clicking the button below',
                                            fontColor: color.good_black,
                                            fontWeight: 600,
                                            fontSize: 16,
                                          }}
                                          second={
                                            <BlueAddButton
                                              text="Add New Video"
                                              onPress={() => {
                                                modal(
                                                  <AddNewVideoModal
                                                    courseId={courseId}
                                                    lessonId={lesson.id}
                                                  />,
                                                  'Add New Video',
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
                                      </div>
                                    )}
                                    <MaterialAccordion
                                      expanded={
                                        materialExpanded ===
                                        `material${lesson.id}`
                                      }
                                      onChange={handleMaterialChange(
                                        `material${lesson.id}`,
                                      )}
                                      materials={lesson.materials}
                                      id={lesson.id}
                                      courseId={courseId}
                                    />
                                    <QuizAccordion
                                      expanded={
                                        quizExpanded === `quiz${lesson.id}`
                                      }
                                      onChange={handleQuizChange(
                                        `quiz${lesson.id}`,
                                      )}
                                      quizzes={lesson.quizzes}
                                      id={lesson.id}
                                      courseId={courseId}
                                    />
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </div>
                          </>
                        ) : (
                          <TextPair
                            first={{
                              text: 'No Lessons yet, you can start adding lesson by clicking the button below',
                              fontColor: color.good_black,
                              fontWeight: 600,
                              fontSize: 16,
                            }}
                            second={
                              <BlueAddButton
                                text="Add New Lesson"
                                onPress={() => {
                                  modal(
                                    <AddNewLessonModel
                                      courseId={courseId}
                                      chapterId={chapter.id}
                                    />,
                                    'Add New Lesson',
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
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          isError && <div>error</div>
        )}
      </div>
      {/* <AddNewChapterModal
        open={open === `add_new_chapter` || open === 'update_chapter'}
        handleClose={() => setOpen(false)}
        courseId={courseId}
      /> */}
      <AlertDialoge
        name="Chapter"
        open={openDeleteChapter}
        onClose={handleDeleteChapterClose}
        deleteMutaion={() => deleteChapterMutation.mutate()}
      />
      <AlertDialoge
        name="Lesson"
        open={openDeleteLesson}
        onClose={handleDeleteLessonClose}
        deleteMutaion={() => deleteLessonMutation.mutate()}
      />
    </>
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
