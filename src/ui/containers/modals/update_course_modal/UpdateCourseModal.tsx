import './style/index.scss';
import color from '@assets/styles/color';
import SelectField from '@components/inputs/select_field';
import Field from '@components/inputs/field';
import FileField from '@components/inputs/file_field';
import TextButton from '@components/buttons/text_button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextAreaField from '@components/inputs/text_area/TextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Course,
  Grades,
  SemesterType,
  SubjectRes,
  Teacher,
} from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import {
  fetchGrades,
  filterSubject,
} from '@services/api/grades_api/grades.api';
import LoadingSpinner from '@components/loading_spinner';
import { fetchUsers } from '@services/api/user_api/user.api';
import { updateCourse } from '@services/api/course_api/course.api';
import toast from 'react-hot-toast';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';
import ErrorAlert from '@components/error_alert';
import Checkbox from '@components/inputs/checkbox';

export interface UpdateCourseProps {
  courseId: string;
  title: string;
  price: number;
  description?: string;
  semester: SemesterType[];
  teacherId: string;
  topRated: boolean;
  popular: boolean;
  file?: FileList;
  domain: {
    gradeId: string;
    subjectId: string;
  };
}

const schema = z.object({
  title: z.string().min(3, 'Title is required').optional(),
  price: z.coerce.number().positive('price is required').optional(),
  description: z.string().optional(),
  domain: z
    .object({
      gradeId: z.string().min(1, 'Grade is required'),
      subjectId: z.string().min(1, 'Subject is required'),
    })
    .optional(),
  semester: z.array(z.string()).min(1, 'Semester is required').optional(),
  teacherId: z.string().min(1, 'Teacher is required').optional(),
  topRated: z.boolean().optional(),
  popular: z.boolean().optional(),
  file: z.custom<FileList>().optional(),
});

interface UpdateCourseModalProps {
  course: Course;
}
export default function UpdateCourseModal({ course }: UpdateCourseModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, watch } = useForm<
    Omit<UpdateCourseProps, 'courseId'>
  >({
    defaultValues: {
      title: course.title ? course.title : '',
      price: course.price ? course.price : 0,
      description: course.description ? course.description : '',
      semester: course.semester ? course.semester : [],
      teacherId: course.teacher.id ? course.teacher.id : '',
      topRated: course.topRated ? course.topRated : false,
      popular: course.popular ? course.popular : false,
      file: undefined,
      domain: {
        gradeId: course.grade.id ? course.grade.id : '',
        subjectId: course.subject.id ? course.subject.id : '',
      },
    },
    resolver: zodResolver(schema),
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    refetch: usersRefetch,
  } = useQuery<Teacher[]>({
    queryKey: [queriesKeys.Users],
    queryFn: fetchUsers,
  });

  const teachers =
    isUsersSuccess && users.length > 0
      ? users.filter((user) => {
          return user.role === 'TEACHER';
        })
      : [];

  const {
    data: grades,
    isSuccess: isGradesSuccess,
    isError: isGradeError,

    refetch: gradeRefetch,
  } = useQuery<Grades[]>({
    queryKey: [queriesKeys.Grades],
    queryFn: fetchGrades,
    enabled: !!isUsersSuccess,
  });
  const {
    data: subjects,
    isSuccess: isSubjectsSuccess,
    isLoading,
    isError: isSubjectError,

    refetch: subjectRefetch,
  } = useQuery<SubjectRes[]>({
    queryKey: [queriesKeys.Branches, watch('domain.gradeId')],
    queryFn: () => {
      return filterSubject(watch('domain.gradeId'));
    },
    enabled: isGradesSuccess && watch('domain.gradeId') != '',
  });

  const updateCourseMutate = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, course.id],
      });
      close();
      toast.success('Course has been updated successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<Omit<UpdateCourseProps, 'courseId'>> = async (
    formData,
  ) => {
    const fd = new FormData();

    if (formData.file && formData.file.length > 0) {
      fd.append('file', formData.file[0] as File);
    }
    if (formData.title) fd.append('title', formData.title);
    fd.append('courseId', course.id);

    if (!isNaN(Number(formData.price)))
      fd.append('price', formData.price.toString());
    if (formData.description) fd.append('description', formData.description);
    if (formData.teacherId) fd.append('teacherId', formData.teacherId);
    if (formData.domain.subjectId)
      fd.append('subjectId', formData.domain.subjectId);
    if (formData.popular) fd.append('popular', 'true');
    if (formData.topRated) fd.append('topRated', 'true');

    formData.semester.map((semester) => {
      fd.append('semester', semester.toString());
    });

    if (formData.domain.gradeId) fd.append('gradeId', formData.domain.gradeId);

    await updateCourseMutate.mutate(fd);
  };

  return (
    <>
      {(isLoading && watch('domain.gradeId').length > 1) || isUsersLoading ? (
        <div className="loading-wrapper">
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isGradesSuccess && isUsersSuccess ? (
        <>
          <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
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
              type="number"
              label="Price"
              inputBorder={true}
              controllerProps={{
                name: 'price',
                control: control,
              }}
            />

            <SelectField
              label="Grade"
              inputBorder={true}
              controllerProps={{ name: 'domain.gradeId', control: control }}
              options={grades.map((grade) => {
                return { value: `${grade.id}`, label: `${grade.value}` };
              })}
            />
            <SelectField
              label="Subject"
              inputBorder={true}
              controllerProps={{ name: 'domain.subjectId', control: control }}
              options={
                grades.length > 0 && isSubjectsSuccess
                  ? subjects.map((subject) => {
                      return {
                        value: subject.id,
                        label: subject.name,
                      };
                    })
                  : []
              }
            />
            <TextAreaField
              type="text"
              label="Description"
              inputBorder={true}
              controllerProps={{
                name: 'description',
                control: control,
              }}
            />
            <SelectField
              label="Semester"
              inputBorder={true}
              multiple={true}
              controllerProps={{ name: 'semester', control: control }}
              options={[
                { value: 'SEMESTER_1', label: 'SEMESTER_1' },
                { value: 'SEMESTER_2', label: 'SEMESTER_2' },
                { value: 'SEMESTER_3', label: 'SEMESTER_3' },
              ]}
            />
            <SelectField
              label="Teacher"
              inputBorder={true}
              controllerProps={{ name: 'teacherId', control: control }}
              options={teachers.map((teacher) => {
                return { value: `${teacher.id}`, label: `${teacher.name}` };
              })}
            />

            <FileField
              label="Image"
              inputBorder={true}
              inputProps={{ accept: 'image/*' }}
              register={{ ...register('file') }}
              controllerProps={{ name: 'file', control: control }}
            />
            <div className="checkbox-container">
              <Checkbox
                label="Top rated"
                controllerProps={{ name: 'topRated', control: control }}
              />
              <Checkbox
                label="Popular"
                controllerProps={{ name: 'popular', control: control }}
              />
            </div>
          </form>
          <div className="form-controls">
            {updateCourseMutate.isLoading ? (
              <LoadingSpinner height={50} width={50} />
            ) : (
              <>
                <TextButton
                  text="Cancel"
                  fontColor={color.good_black}
                  fontWeight={600}
                  padding={'8px 15px'}
                  onPress={() => {
                    close();
                  }}
                />
                <TextButton
                  text={'Update'}
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
        </>
      ) : (
        (isGradeError || isSubjectError || isUsersError) && (
          <ErrorAlert
            button={true}
            defaultMessage={true}
            referch={() => {
              gradeRefetch();
              usersRefetch();
              subjectRefetch();
            }}
          />
        )
      )}
    </>
  );
}
